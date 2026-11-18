// 내 입력 달력의 날짜 칸 하나가 어떻게 보일지: 고를 수 있는지, 고른 날의 이어진 모양, 오늘, 저장된 묶음 막대.
import type { AvailabilityGroup } from '@/api/availability';

import { barTonesOn, type BarTone } from './availabilityGroups';
import type { CalendarDay, DateKey } from './monthGrid';
import { isPickable, pickedShape, type PickedShape } from './pickedDates';

export type DayCellLook = { disabled: boolean; shape: PickedShape; today: boolean; barTones: BarTone[] };

type CalendarContext = {
  range: { start: DateKey; end: DateKey };
  picked: DateKey[];
  groups: AvailabilityGroup[];
  today: DateKey;
};

// 앞뒤 달로 채운 칸은 그 달을 넘기면 다시 보이니, 회색으로만 두고 모양과 막대를 그리지 않는다.
export function dayCellLook(day: Pick<CalendarDay, 'key' | 'inMonth'>, context: CalendarContext): DayCellLook {
  if (!day.inMonth) return { disabled: true, shape: 'none', today: false, barTones: [] };
  return {
    disabled: !isPickable(day.key, context.range),
    shape: pickedShape(context.picked, day.key),
    today: day.key === context.today,
    barTones: barTonesOn(context.groups, day.key),
  };
}
