// 확인 창, 안내 창, 공유 시트를 플랫폼에 맞게 띄운다.
// 순수 로직은 아니지만, 웹에서 React Native의 Alert가 아무것도 하지 않아(react-native-web) 그 차이를 화면 밖 한 곳에 모은다.
import { Alert, Platform, Share } from 'react-native';

type ConfirmOptions = { title: string; message: string; confirmLabel: string };

// 확인을 누르면 true. 웹은 브라우저 기본 확인 창이다.
export function confirm({ title, message, confirmLabel }: ConfirmOptions): Promise<boolean> {
  if (Platform.OS === 'web') return Promise.resolve(window.confirm(`${title}\n${message}`));
  return new Promise((resolve) => {
    Alert.alert(title, message, [
      { text: '취소', style: 'cancel', onPress: () => resolve(false) },
      { text: confirmLabel, onPress: () => resolve(true) },
    ]);
  });
}

export function notify(title: string, message: string) {
  if (Platform.OS === 'web') window.alert(`${title}\n${message}`);
  else Alert.alert(title, message);
}

// 링크를 OS 공유 시트로 보낸다. 사람이 시트를 닫은 것은 실패가 아니다.
// 공유 창이 없는 브라우저처럼 공유하지 못하면 링크를 보여주고 직접 보내 달라고 안내한다.
export async function shareLink(link: string) {
  try {
    await Share.share({ message: link });
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') return;
    notify('공유하지 못했어요', `아래 링크를 복사해 보내 주세요.\n${link}`);
  }
}
