// 지금의 로그인 단계(src/api/auth.ts의 AuthStage). 루트 레이아웃이 이 값으로 들어갈 수 있는 화면을 고른다.
// 로그인, 약관, 프로필, 참여 화면이 api를 부른 뒤 refresh하면 레이아웃이 다시 그려져 알맞은 화면으로 옮겨 간다.
// 단계의 원본은 api다. 이 스토어는 여러 화면이 같은 값을 보고 바뀐 것을 알게 하는 데만 쓴다.
import { create } from 'zustand';

import { getAuthStage, type AuthStage } from '@/api/auth';

type AuthStageStore = {
  // 처음 불러오기 전에는 null
  stage: AuthStage | null;
  refresh: () => Promise<void>;
};

export const useAuthStage = create<AuthStageStore>((set) => ({
  stage: null,
  refresh: async () => set({ stage: await getAuthStage() }),
}));
