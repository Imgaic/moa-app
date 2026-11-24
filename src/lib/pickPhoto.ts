// 기기 사진첩에서 사진 한 장을 고른다. 고르지 않고 닫으면 null이다.
// 순수 로직은 아니지만 dialogs.ts처럼 플랫폼 기능을 화면 밖 한 곳에 모은다.
// expo-image-picker(SDK 58)는 iOS, Android, 웹, Expo Go에서 모두 되고, 사진첩을 열 때는 권한 요청이 필요 없다.
import { launchImageLibraryAsync } from 'expo-image-picker';

export async function pickPhoto(): Promise<string | null> {
  const result = await launchImageLibraryAsync({
    mediaTypes: ['images'],
    // 프로필은 동그라미라 정사각형으로 자른다(iOS는 늘 정사각형, Android는 aspect를 따른다).
    allowsEditing: true,
    aspect: [1, 1],
  });
  return result.canceled ? null : result.assets[0].uri;
}
