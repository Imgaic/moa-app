import { useState } from 'react';
import { Text, View } from 'react-native';
import { GestureDetector } from 'react-native-gesture-handler';

import { useTimeBarGestures } from '@/hooks/useTimeBarGestures';
import { tickMinutes, tickText, xOfMinutes } from '@/lib/timeBarScale';
import { initialWindow } from '@/lib/timeBarWindow';

// 피그마 Input/Time Bar (2026-11-18 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
// 눈금 글자, 회색 트랙, 고른 구간의 파란 막대, 흰 원 손잡이 둘. 하루(0~24시) 중 "창"만 보이고 끌기와 확대로 창이 바뀐다.
// 이 파일은 그리기만 한다. 손가락 동작은 src/hooks/useTimeBarGestures.ts, 계산은 src/lib/timeBar*.ts가 맡는다.
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
        <View style={{ height: LABEL_HEIGHT }}>
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
        <View className="rounded-full bg-gray-10" style={{ height: TRACK_HEIGHT }}>
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
