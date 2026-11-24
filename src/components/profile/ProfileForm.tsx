import { View } from 'react-native';

import { ProfileAvatar } from '@/components/ui/ProfileAvatar';
import { TextField } from '@/components/ui/TextField';
import { NAME_MAX_LENGTH } from '@/lib/profileName';

// 프로필 동그라미와 이름 칸. 참여 화면(피그마 04 Join / Profile - Empty, Filled)과
// 온보딩 프로필 화면(01 Onboarding / Profile, Focused, Photo Added)이 같이 쓴다(2026-11-18 기준 두 피그마가 같다).
// 이름을 넣으면 동그라미에 이름 뒤 두 글자가 보인다(docs/open-questions.md T7, T8). 값과 동작은 모두 props로 받는다.
const NAME_TOP = 51;

type ProfileFormProps = {
  name: string;
  onChangeName: (name: string) => void;
  // 기기에서 고른 사진의 주소. 없으면 null
  photoUri: string | null;
  onPickPhoto: () => void;
};

export function ProfileForm({ name, onChangeName, photoUri, onPickPhoto }: ProfileFormProps) {
  return (
    <View>
      <View className="items-center">
        <ProfileAvatar
          name={name}
          photo={photoUri ? { uri: photoUri } : undefined}
          onPressCamera={onPickPhoto}
        />
      </View>
      <View style={{ marginTop: NAME_TOP }}>
        <TextField
          value={name}
          onChangeText={onChangeName}
          maxLength={NAME_MAX_LENGTH}
          placeholder="이름"
          helper="2~10자로 입력해 주세요."
        />
      </View>
    </View>
  );
}
