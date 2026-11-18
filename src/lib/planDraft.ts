// 약속 만들기에서 단계 사이에 들고 다니는 입력값과, 단계의 순서와 다음으로 갈 수 있는 조건.
import type { NewPlan, PlaceMode } from '@/api/plans';
import type { Place } from '@/api/places';

import { EMPTY_RANGE, type DateRange } from './dateRange';

// 피그마 Name 단계의 도움말 "2~10자로 입력해 주세요."
export const TITLE_MIN_LENGTH = 2;
export const TITLE_MAX_LENGTH = 10;
// 필요한 시간의 처음 값. 피그마에 없어 가장 흔할 듯한 1시간으로 두었다(docs/open-questions.md).
const DEFAULT_DURATION_MINUTES = 60;

export type PlanDraft = {
  title: string;
  durationMinutes: number;
  dateRange: DateRange;
  placeMode: PlaceMode | null;
  // "정해져 있어요"에서 고른 장소. 추천받기로 바꿔도 지우지 않아 다시 고를 때 남아 있다.
  fixedPlace: Place | null;
};

export const EMPTY_DRAFT: PlanDraft = {
  title: '',
  durationMinutes: DEFAULT_DURATION_MINUTES,
  dateRange: EMPTY_RANGE,
  placeMode: null,
  fixedPlace: null,
};

// placeSearch는 place 단계 안에서 잠깐 여는 장소 찾기다.
export type CreateStep = 'name' | 'duration' | 'dateRange' | 'place' | 'placeSearch' | 'share';

const STEP_ORDER: CreateStep[] = ['name', 'duration', 'dateRange', 'place', 'share'];

export function isTitleValid(title: string): boolean {
  const length = title.trim().length;
  return length >= TITLE_MIN_LENGTH && length <= TITLE_MAX_LENGTH;
}

// 다 채웠으면 createPlan에 보낼 값, 빠진 것이 있으면 null
export function toNewPlan(draft: PlanDraft): NewPlan | null {
  const { start, end } = draft.dateRange;
  if (!isTitleValid(draft.title) || start === null || end === null || draft.placeMode === null) {
    return null;
  }
  const fixedPlace = draft.placeMode === 'fixed' ? draft.fixedPlace : null;
  if (draft.placeMode === 'fixed' && fixedPlace === null) return null;

  return {
    title: draft.title.trim(),
    durationMinutes: draft.durationMinutes,
    dateRange: { start, end },
    placeMode: draft.placeMode,
    fixedPlace,
  };
}

export function nextStep(step: CreateStep): CreateStep {
  return STEP_ORDER[STEP_ORDER.indexOf(step) + 1] ?? step;
}

// 이름 단계에서 뒤로 가면 만들기를 나간다(null).
export function previousStep(step: CreateStep): CreateStep | null {
  if (step === 'placeSearch') return 'place';
  return STEP_ORDER[STEP_ORDER.indexOf(step) - 1] ?? null;
}

export function isStepComplete(step: CreateStep, draft: PlanDraft): boolean {
  switch (step) {
    case 'name':
      return isTitleValid(draft.title);
    case 'dateRange':
      return draft.dateRange.end !== null;
    case 'place':
    case 'share':
      return toNewPlan(draft) !== null;
    default:
      return true;
  }
}

// 피그마 Summary/Create: 지금 단계보다 앞에서 답한 값만 화면 아래에 보인다.
export function summaryOf(
  step: CreateStep,
  draft: PlanDraft,
): { title?: string; durationMinutes?: number; dateRange?: NewPlan['dateRange'] } {
  const answered = (earlier: CreateStep) =>
    step !== 'share' && STEP_ORDER.indexOf(step) > STEP_ORDER.indexOf(earlier);
  const { start, end } = draft.dateRange;
  return {
    ...(answered('name') ? { title: draft.title.trim() } : {}),
    ...(answered('duration') ? { durationMinutes: draft.durationMinutes } : {}),
    ...(answered('dateRange') && start && end ? { dateRange: { start, end } } : {}),
  };
}
