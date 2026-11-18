import { useState } from 'react';
import { Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { useTimeBarGestures } from '@/hooks/useTimeBarGestures';
import { clockText } from '@/lib/clockTime';
import { dragHandle, LAST_MINUTE } from '@/lib/timeBarDrag';
import { snapStepOf, tickMinutes, tickText, xOfMinutes } from '@/lib/timeBarScale';
import { initialWindow, revealMinutes, windowSpan } from '@/lib/timeBarWindow';

// 피그마 Input/Time Bar (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 눈금 글자, 회색 트랙, 고른 구간의 파란 막대, 흰 원 손잡이 둘. 하루(0~24시) 중 "창"만 보이고 끌기와 확대로 창이 바뀐다.
// 이 파일은 그리기만 한다. 손가락 동작은 src/hooks/useTimeBarGestures.ts, 계산은 src/lib/timeBar*.ts가 맡는다.
// 화면 낭독기와 키보드는 끌 수 없어, 시작과 종료를 한 간격씩 올리고 내리는 보이지 않는 자리(EdgeAdjuster)를 둔다.
const LABEL_WIDTH = 38;
const LABEL_HEIGHT = 16;
const LABEL_GAP = 6;
const TRACK_HEIGHT = 15;
const RANGE_HEIGHT = 9;
const KNOB_SIZE = 20;
const KNOB_RADIUS = KNOB_SIZE / 2;
// 피그마 손잡이 그림자: 번짐 2, 검정 15%
const KNOB_SHADOW = '0px 0px 2px 0px rgba(0, 0, 0, 0.15)';
// 손잡이가 창 끝에 딱 붙었을 때 소수점 오차로 사라지지 않게
const VISIBLE_TOLERANCE = 0.5;
const ADJUST_ACTIONS = [{ name: 'increment' }, { name: 'decrement' }];
// 웹에는 올리기·내리기 동작이 없어 슬라이더의 화살표 키로 받는다.
const KEY_DIRECTIONS: Record<string, 1 | -1> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 };

type TimeBarProps = {
  // 자정부터 센 분(600 = 오전 10:00)
  startMinutes: number;
  endMinutes: number;
  onChange: (startMinutes: number, endMinutes: number) => void;
};

export function TimeBar({ startMinutes, endMinutes, onChange }: TimeBarProps) {
  const [trackWidth, setTrackWidth] = useState(0);
  const [window, setWindow] = useState(() => initialWindow(startMinutes, endMinutes));
  // 손잡이 중심이 다니는 폭. 손잡이가 트랙 밖으로 삐져나가지 않게 양쪽 반지름만큼 줄인다.
  const width = Math.max(0, trackWidth - KNOB_SIZE);
  const { gesture, webWheelRef } = useTimeBarGestures({
    width,
    inset: KNOB_RADIUS,
    window,
    onWindowChange: setWindow,
    range: { start: startMinutes, end: endMinutes },
    onRangeChange: ({ start, end }) => onChange(start, end),
  });

  // 끌 때와 같은 규칙(스냅 간격, 최소 길이, 하루 안)으로 한 간격 옮기고, 창 밖으로 나가면 창이 따라간다.
  const stepEdge = (edge: 'start' | 'end', direction: 1 | -1) => {
    const range = { start: startMinutes, end: endMinutes };
    const step = snapStepOf(windowSpan(window));
    const next = dragHandle(range, edge, range[edge] + direction * step, step);
    if (next[edge] === range[edge]) return;
    setWindow(revealMinutes(window, next[edge]));
    onChange(next.start, next.end);
  };

  const xOf = (minutes: number) => KNOB_RADIUS + xOfMinutes(minutes, window, width);
  const insideTrack = (x: number) => Math.min(trackWidth, Math.max(0, x));
  // 글자 반쪽이 손잡이 반지름보다 넓어, 창 끝에 붙은 눈금은 글자가 막대 밖으로 넘친다. 그만큼 안쪽 눈금만 쓴다.
  const labelOverflow = LABEL_WIDTH / 2 - KNOB_RADIUS;
  const startX = xOf(startMinutes);
  const endX = xOf(endMinutes);

  return (
    <GestureDetector gesture={gesture}>
      <View
        ref={webWheelRef}
        accessibilityLabel="시간 막대"
        onLayout={(event) => setTrackWidth(event.nativeEvent.layout.width)}
        style={{ gap: LABEL_GAP }}>
        <View aria-hidden style={{ height: LABEL_HEIGHT }}>
          {width > 0 &&
            tickMinutes(window, width, labelOverflow).map((minutes) => (
              <Text
                key={minutes}
                selectable={false}
                className="absolute text-center font-pretendard text-caption-12 text-black"
                style={{ left: xOf(minutes) - LABEL_WIDTH / 2, width: LABEL_WIDTH }}>
                {tickText(minutes)}
              </Text>
            ))}
        </View>
        <View aria-hidden className="rounded-full bg-gray-10" style={{ height: TRACK_HEIGHT }}>
          {width > 0 && (
            <>
              <View
                className="absolute rounded-full bg-blue-50"
                style={{
                  left: insideTrack(startX),
                  width: insideTrack(endX) - insideTrack(startX),
                  top: (TRACK_HEIGHT - RANGE_HEIGHT) / 2,
                  height: RANGE_HEIGHT,
                }}
              />
              <Knob x={startX} visible={isVisible(startX, width)} />
              <Knob x={endX} visible={isVisible(endX, width)} />
            </>
          )}
        </View>
        <EdgeAdjuster
          label="시작 시각"
          side="left"
          minutes={startMinutes}
          onStep={(direction) => stepEdge('start', direction)}
        />
        <EdgeAdjuster
          label="종료 시각"
          side="right"
          minutes={endMinutes}
          onStep={(direction) => stepEdge('end', direction)}
        />
      </View>
    </GestureDetector>
  );
}

// 창 밖으로 나간 손잡이는 그리지 않는다(파란 막대만 끝까지 이어진다).
function isVisible(x: number, width: number) {
  return x >= KNOB_RADIUS - VISIBLE_TOLERANCE && x <= KNOB_RADIUS + width + VISIBLE_TOLERANCE;
}

function Knob({ x, visible }: { x: number; visible: boolean }) {
  if (!visible) return null;
  return (
    <View
      className="absolute rounded-full bg-white"
      style={{
        left: x - KNOB_RADIUS,
        top: (TRACK_HEIGHT - KNOB_SIZE) / 2,
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        boxShadow: KNOB_SHADOW,
      }}
    />
  );
}

type EdgeAdjusterProps = {
  label: string;
  // 막대의 왼쪽 절반이 시작, 오른쪽 절반이 종료 자리다. 손잡이는 창 밖으로 나가면 사라져 자리로 쓸 수 없다.
  side: 'left' | 'right';
  minutes: number;
  onStep: (direction: 1 | -1) => void;
};

function EdgeAdjuster({ label, side, minutes, onStep }: EdgeAdjusterProps) {
  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      aria-valuetext={clockText(minutes)}
      aria-valuenow={minutes}
      aria-valuemin={0}
      aria-valuemax={LAST_MINUTE}
      accessibilityActions={ADJUST_ACTIONS}
      onAccessibilityAction={({ nativeEvent }) => onStep(nativeEvent.actionName === 'increment' ? 1 : -1)}
      tabIndex={0}
      onKeyDown={(event) => {
        const direction = KEY_DIRECTIONS[event.nativeEvent.key];
        if (!direction) return;
        // 화살표 키가 화면을 스크롤하지 않게
        event.preventDefault();
        onStep(direction);
      }}
      className={`absolute inset-y-0 w-1/2 ${side === 'left' ? 'left-0' : 'right-0'}`}
    />
  );
}
