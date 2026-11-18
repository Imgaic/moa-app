// 시간 막대의 손가락·마우스 입력을 창 이동과 시작·종료 변화로 바꾼다. 계산은 src/lib/timeBar*.ts에 맡긴다.
// 한 손가락: 누른 곳이 손잡이 근처면 손잡이 끌기(끝 띠에 머물면 창이 계속 밀린다), 아니면 축 끌기.
// 두 손가락: 확대·축소. 한 손가락 끌기는 maxPointers 1이라 두 번째 손가락이 먼저 닿으면 실패하고 확대가 이긴다.
// 웹: 마우스 휠(맥 트랙패드의 두 손가락 오므리기도 휠로 온다)로 확대·축소, 가로 스크롤로 축 이동.
import { useEffect, useLayoutEffect, useRef } from 'react';
import { Platform, type ViewInstance } from 'react-native';
import { useCompetingGestures, usePanGesture, usePinchGesture } from 'react-native-gesture-handler';

import { dragHandle, dragTargetAt, type DragTarget, type TimeRange } from '@/lib/timeBarDrag';
import { minutesAtX, snapStepOf, xOfMinutes } from '@/lib/timeBarScale';
import { edgePushMinutes, panWindow, windowSpan, zoomWindow, type TimeWindow } from '@/lib/timeBarWindow';

// 손잡이(지름 20) 중심에서 이 거리 안을 누르면 손잡이를 잡는다. 손가락 끝이 가리는 폭을 생각해 넉넉히 잡았다.
const HANDLE_HIT_RADIUS = 22;
// 창 양 끝에서 손잡이가 이 안에 들어오면 창을 민다(화면 점)
const EDGE_ZONE = 28;
// 가로로 이만큼 움직이면 끌기가 시작되고, 그 전에 세로로 이만큼 움직이면 화면 스크롤에 양보한다.
const ACTIVE_OFFSET_X = 3;
const FAIL_OFFSET_Y = 12;
// 웹 휠 한 칸(약 100)에 창이 약 1.5배 바뀐다.
const WHEEL_ZOOM_PER_PIXEL = 0.004;

type TimeBarGestureInput = {
  // 손잡이 중심이 다니는 폭과, 막대 왼쪽 끝에서 그 폭이 시작하는 곳(손잡이 반지름)
  width: number;
  inset: number;
  window: TimeWindow;
  onWindowChange: (window: TimeWindow) => void;
  range: TimeRange;
  onRangeChange: (range: TimeRange) => void;
};

// 한 손가락 끌기 하나. grabOffset은 누른 곳과 손잡이 중심의 거리다(손잡이가 손가락 쪽으로 튀지 않게).
type Drag = { target: DragTarget; handleX: number; grabOffset: number; xAtStart: number; windowAtStart: TimeWindow };
type Zoom = { windowAtStart: TimeWindow; anchorRatio: number };

export function useTimeBarGestures(input: TimeBarGestureInput) {
  // 손가락 콜백과 프레임 반복이 늘 최신 값을 읽게 한다. 바꾼 값은 다시 그려지기 전에도 바로 여기에 적는다.
  const latest = useRef(input);
  useLayoutEffect(() => {
    latest.current = input;
  });
  const drag = useRef<Drag | null>(null);
  const zoom = useRef<Zoom | null>(null);
  const pushFrame = useRef<number | null>(null);
  const webWheelRef = useRef<ViewInstance>(null);

  const changeWindow = (window: TimeWindow) => {
    latest.current = { ...latest.current, window };
    latest.current.onWindowChange(window);
  };

  const moveHandle = (current: Drag) => {
    if (current.target === 'axis') return;
    const { window, width, range, onRangeChange } = latest.current;
    const minutes = minutesAtX(current.handleX, window, width);
    const next = dragHandle(range, current.target, minutes, snapStepOf(windowSpan(window)));
    if (next.start === range.start && next.end === range.end) return;
    latest.current = { ...latest.current, range: next };
    onRangeChange(next);
  };

  // 손잡이를 끄는 동안 매 프레임, 손잡이가 끝 띠에 있으면 창을 밀고 손잡이 아래 시각을 다시 고른다.
  const startEdgePush = () => {
    let lastTime: number | null = null;
    const step = (now: number) => {
      const current = drag.current;
      if (!current || current.target === 'axis') return void (pushFrame.current = null);
      const { window, width } = latest.current;
      const elapsed = lastTime === null ? 0 : now - lastTime;
      lastTime = now;
      const delta = edgePushMinutes(current.handleX, width, EDGE_ZONE, windowSpan(window), elapsed);
      if (delta !== 0) {
        changeWindow(panWindow(window, delta));
        moveHandle(current);
      }
      pushFrame.current = requestAnimationFrame(step);
    };
    pushFrame.current = requestAnimationFrame(step);
  };

  const stopEdgePush = () => {
    if (pushFrame.current !== null) cancelAnimationFrame(pushFrame.current);
    pushFrame.current = null;
  };
  useEffect(() => stopEdgePush, []);

  const pan = usePanGesture({
    runOnJS: true,
    maxPointers: 1,
    activeOffsetX: [-ACTIVE_OFFSET_X, ACTIVE_OFFSET_X],
    failOffsetY: [-FAIL_OFFSET_Y, FAIL_OFFSET_Y],
    onBegin: ({ x }) => {
      const { window, width, inset, range } = latest.current;
      const handles = { startX: xOfMinutes(range.start, window, width), endX: xOfMinutes(range.end, window, width) };
      const innerX = x - inset;
      const target = dragTargetAt(innerX, handles, width, HANDLE_HIT_RADIUS);
      const handleX = target === 'start' ? handles.startX : target === 'end' ? handles.endX : innerX;
      drag.current = { target, handleX, grabOffset: handleX - innerX, xAtStart: innerX, windowAtStart: window };
    },
    onActivate: () => {
      if (drag.current && drag.current.target !== 'axis') startEdgePush();
    },
    onUpdate: ({ x }) => {
      const current = drag.current;
      if (!current) return;
      const innerX = x - latest.current.inset;
      if (current.target === 'axis') {
        const { width } = latest.current;
        const minutesPerPoint = windowSpan(current.windowAtStart) / width;
        changeWindow(panWindow(current.windowAtStart, -(innerX - current.xAtStart) * minutesPerPoint));
        return;
      }
      current.handleX = innerX + current.grabOffset;
      moveHandle(current);
    },
    onFinalize: () => {
      drag.current = null;
      stopEdgePush();
    },
  });

  const pinch = usePinchGesture({
    runOnJS: true,
    onActivate: ({ focalX }) => {
      const { window, width, inset } = latest.current;
      zoom.current = { windowAtStart: window, anchorRatio: Math.min(1, Math.max(0, (focalX - inset) / width)) };
    },
    onUpdate: ({ scale }) => {
      if (zoom.current) changeWindow(zoomWindow(zoom.current.windowAtStart, zoom.current.anchorRatio, scale));
    },
    onFinalize: () => {
      zoom.current = null;
    },
  });

  useEffect(() => {
    // 웹에서 View의 ref는 DOM 요소다. 화면 스크롤을 막으려면 passive가 아닌 리스너가 필요해 직접 붙인다.
    const node = webWheelRef.current as unknown as HTMLElement | null;
    if (Platform.OS !== 'web' || !node) return;
    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      const { window, width, inset } = latest.current;
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        changeWindow(panWindow(window, (event.deltaX / width) * windowSpan(window)));
        return;
      }
      const anchorRatio = Math.min(1, Math.max(0, (event.clientX - node.getBoundingClientRect().left - inset) / width));
      changeWindow(zoomWindow(window, anchorRatio, Math.exp(-event.deltaY * WHEEL_ZOOM_PER_PIXEL)));
    };
    node.addEventListener('wheel', onWheel, { passive: false });
    return () => node.removeEventListener('wheel', onWheel);
    // changeWindow는 latest만 읽으니 처음 한 번만 붙인다.
  }, []);

  return { gesture: useCompetingGestures(pinch, pan), webWheelRef };
}
