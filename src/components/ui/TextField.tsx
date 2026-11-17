import { cssInterop } from 'nativewind';
import { Pressable, Text, TextInput, View } from 'react-native';

// placeholderClassName의 글자색(text-*)을 placeholderTextColor로 넘긴다.
cssInterop(TextInput, {
  className: { target: 'style', nativeStyleToProp: { textAlign: true } },
  placeholderClassName: { target: false, nativeStyleToProp: { color: 'placeholderTextColor' } },
});

// 피그마 Input/Text (2026-11-17 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
const GAP = 'gap-[8px]';
const FIELD = 'h-[45px] flex-row items-center py-[2px]';
const LINE_EMPTY = 'border-b border-gray-40';
const LINE_FILLED = 'border-b-[1.5px] border-blue-50';
const CONFIRM_HIT_SLOP = 12;

type TextFieldProps = {
  value: string;
  onChangeText: (text: string) => void;
  maxLength: number;
  placeholder?: string;
  label?: string;
  helper?: string;
  confirmLabel?: string;
  onConfirm?: () => void;
};

// 상태: Empty(값이 없을 때) / Filled(값이 있을 때)
export function TextField({
  value,
  onChangeText,
  maxLength,
  placeholder,
  label,
  helper,
  confirmLabel,
  onConfirm,
}: TextFieldProps) {
  const filled = value.length > 0;
  return (
    <View className={GAP}>
      {label ? <Text className="font-pretendard text-body2 text-gray-50">{label}</Text> : null}

      <View className={`${FIELD} ${filled ? LINE_FILLED : LINE_EMPTY}`}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          maxLength={maxLength}
          placeholder={placeholder}
          accessibilityLabel={label ?? placeholder}
          className={`flex-1 font-pretendard text-gray-50 ${filled ? 'text-h2' : 'text-body2'}`}
          placeholderClassName="text-gray-30"
        />
        {confirmLabel ? (
          <Pressable
            accessibilityRole="button"
            hitSlop={CONFIRM_HIT_SLOP}
            onPress={onConfirm}>
            <Text className="font-pretendard text-caption-14 text-black">{confirmLabel}</Text>
          </Pressable>
        ) : null}
      </View>

      <View className="flex-row justify-between">
        <Text className="font-pretendard text-caption-14 text-gray-30">{helper}</Text>
        <Text className="font-pretendard text-caption-14 text-gray-30">
          {value.length}/{maxLength}
        </Text>
      </View>
    </View>
  );
}
