import { Pressable, Text, View } from 'react-native';
import {
  Defs,
  FeGaussianBlur,
  Filter,
  G,
  Image as SvgImage,
  Mask,
  Path,
} from 'react-native-svg';

import { Svg } from './Svg';

// 피그마 Button/Social (2026-11-17 기준). 디자인이 완성 전이라 수치가 바뀔 수 있다.
const BOX = 'h-[60px] w-full items-center justify-center rounded-[10px]';
const ICON_SIZE = 40;
const APPLE_ICON_HEIGHT = 43;
const ICON_LEFT = { kakao: 16, naver: 16, google: 15, apple: 15 } as const;

export type SocialProvider = 'kakao' | 'google' | 'naver' | 'apple';

const LOOK: Record<SocialProvider, { label: string; box: string; text: string }> = {
  kakao: { label: '카카오로 로그인', box: 'bg-kakao', text: 'text-gray-60' },
  google: { label: '구글로 로그인', box: 'bg-google border border-gray-10', text: 'text-gray-60' },
  naver: { label: '네이버로 로그인', box: 'bg-naver', text: 'text-white' },
  apple: { label: '애플로 로그인', box: 'bg-black border border-gray-10', text: 'text-white' },
};

type SocialButtonProps = {
  provider: SocialProvider;
  onPress?: () => void;
};

export function SocialButton({ provider, onPress }: SocialButtonProps) {
  const look = LOOK[provider];
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={look.label}
      onPress={onPress}
      className={`${BOX} ${look.box}`}>
      <View
        className="absolute inset-y-0 justify-center"
        style={{ left: ICON_LEFT[provider] }}>
        <Logo provider={provider} />
      </View>
      <Text className={`font-pretendard text-body1 ${look.text}`}>{look.label}</Text>
    </Pressable>
  );
}

// 로고 도형은 피그마에서 내보낸 SVG 경로를 그대로 옮겼다.
function Logo({ provider }: { provider: SocialProvider }) {
  switch (provider) {
    case 'kakao':
      return (
        <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 40 40" className="text-gray-60">
          <Path
            fill="currentColor"
            d="M20.0012 10C14.4764 10 10 13.8303 10 18.5548C10 21.5915 11.8516 24.2597 14.6416 25.7768L13.6982 29.5883C13.6632 29.7021 13.6906 29.824 13.7658 29.908C13.8208 29.9676 13.8958 30 13.9684 30C14.031 30 14.0936 29.9784 14.146 29.9322L18.1996 26.9687C18.7827 27.0581 19.3832 27.1069 19.9987 27.1069C25.5211 27.1069 30 23.2764 30 18.552C30 13.8277 25.5236 10 20.0012 10Z"
          />
        </Svg>
      );
    case 'naver':
      return (
        <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 40 40" className="text-white">
          <Path
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M22.2 20.64L15.53 11H10V29H15.8V19.37L22.47 29H28V11H22.2V20.64Z"
          />
        </Svg>
      );
    case 'apple':
      return (
        <Svg
          width={ICON_SIZE}
          height={APPLE_ICON_HEIGHT}
          viewBox="0 0 40 43"
          className="text-white">
          <Path
            fill="currentColor"
            d="M23.6271 12.9827C24.3824 12.055 24.9174 10.7754 24.9174 9.49584C24.9174 9.3199 24.9017 9.14395 24.8702 9C23.6428 9.04798 22.1479 9.83173 21.2667 10.8874C20.5586 11.7031 19.9135 12.9827 19.9135 14.2783C19.9135 14.4702 19.9449 14.6622 19.9607 14.7262C20.0393 14.7422 20.1652 14.7582 20.2911 14.7582C21.4083 14.7582 22.8088 14.0064 23.6271 12.9827ZM24.4925 15.0301C22.6357 15.0301 21.1251 16.1817 20.1652 16.1817C19.1424 16.1817 17.7891 15.094 16.1684 15.094C13.0999 15.094 10 17.6852 10 22.5317C10 25.5707 11.1487 28.7537 12.5649 30.817C13.7923 32.5605 14.8623 34 16.3887 34C17.915 34 18.5759 32.9603 20.4642 32.9603C22.3839 32.9603 22.8245 33.968 24.4925 33.968C26.1605 33.968 27.2777 32.4165 28.3163 30.881C29.4965 29.1216 29.9843 27.4261 30 27.3301C29.9056 27.2981 26.7113 25.9866 26.7113 22.2758C26.7113 19.0608 29.229 17.6372 29.3706 17.5253C27.7183 15.094 25.2006 15.0301 24.4925 15.0301Z"
          />
        </Svg>
      );
    case 'google':
      return <GoogleLogo />;
  }
}

// 구글 로고는 브랜드 그라데이션이라 토큰 색이 아니다. 피그마와 같이
// 원뿔 그라데이션 이미지 위에 흐린 타원들을 얹고 G 모양으로 잘라 그린다.
const GOOGLE_G =
  'M19.3987 8.1814H9.9849V12.0445H15.3598C15.1286 13.294 14.4294 14.3596 13.3676 15.0712C12.4746 15.6716 11.3266 16.0211 9.9849 16.0211C7.3864 16.0211 5.1823 14.2666 4.3947 11.9004C4.1952 11.2989 4.0853 10.6599 4.0853 9.9983C4.0853 9.3367 4.1952 8.6966 4.3947 8.0962C5.1823 5.7311 7.3864 3.9755 9.9849 3.9755C11.4524 3.9755 12.767 4.4816 13.8039 5.4713L16.6653 2.6057C14.936 0.9908 12.6786 0 9.9849 0C6.0832 0 2.705 2.2414 1.0618 5.5076C0.383 6.8592 0 8.3834 0 9.9994C0 11.6155 0.383 13.1396 1.0618 14.4913C2.705 17.7597 6.0832 20 9.9849 20C12.6797 20 14.9485 19.1137 16.6018 17.5861C18.4887 15.8452 19.5732 13.2702 19.5732 10.2275C19.5732 9.5182 19.5131 8.835 19.3987 8.1825V8.1814Z';

// [x, y, 너비, 높이, 색, 경로] — 피그마 레이어 위치(40x40 기준)
const GOOGLE_BLOBS = [
  [12.998, 14.829, 14.1037, 10.8265, '#3186FF', 'M5.87844 7.99443C8.59155 9.22785 11.3163 9.07211 11.9644 7.64658C12.6125 6.22104 10.9384 4.06553 8.22531 2.83211C5.5122 1.59869 2.78743 1.75443 2.13936 3.17996C1.49129 4.6055 3.16533 6.76101 5.87844 7.99443Z'],
  [23.917, 13.119, 18.8784, 10.1871, '#3186FF', 'M9.43918 8.18714C13.5477 8.18714 16.8784 6.8021 16.8784 5.09357C16.8784 3.38504 13.5477 2 9.43918 2C5.33064 2 2 3.38504 2 5.09357C2 6.8021 5.33064 8.18714 9.43918 8.18714Z'],
  [15.864, 11.84, 18.8171, 8.7561, '#FF4641', 'M9.40854 6.7561C13.5002 6.7561 16.8171 5.69141 16.8171 4.37805C16.8171 3.06469 13.5002 2 9.40854 2C5.31692 2 2 3.06469 2 4.37805C2 5.69141 5.31692 6.7561 9.40854 6.7561Z'],
  [20.136, 8.548, 18.8171, 8.7561, '#FF5B8B', 'M9.40854 6.7561C13.5002 6.7561 16.8171 5.69141 16.8171 4.37805C16.8171 3.06469 13.5002 2 9.40854 2C5.31692 2 2 3.06469 2 4.37805C2 5.69141 5.31692 6.7561 9.40854 6.7561Z'],
  [13.976, 14.768, 21.0122, 10.2195, '#3186FF', 'M10.5061 8.21952C15.2039 8.21952 19.0122 6.82723 19.0122 5.10976C19.0122 3.39229 15.2039 2 10.5061 2C5.80831 2 2 3.39229 2 5.10976C2 6.82723 5.80831 8.21952 10.5061 8.21952Z'],
  [19.039, 9.004, 12.2878, 10.0309, '#FF4641', 'M7.28443 7.10217C9.48403 5.89992 10.7565 3.99106 10.1266 2.83861C9.49672 1.68616 7.20296 1.72653 5.00336 2.92877C2.80375 4.13102 1.53126 6.03988 2.16116 7.19233C2.79106 8.34478 5.08482 8.30441 7.28443 7.10217Z'],
] as const;

function GoogleLogo() {
  return (
    <Svg width={ICON_SIZE} height={ICON_SIZE} viewBox="0 0 40 40">
      <Defs>
        <Mask id="g" maskUnits="userSpaceOnUse" x={0} y={0} width={40} height={40}>
          <Path d={GOOGLE_G} fill="#FFFFFF" transform="translate(10 10)" />
        </Mask>
        {GOOGLE_BLOBS.map(([, , w, h], i) => (
          <Filter
            key={i}
            id={`blur${i}`}
            filterUnits="userSpaceOnUse"
            x={0}
            y={0}
            width={w}
            height={h}>
            <FeGaussianBlur stdDeviation={1} />
          </Filter>
        ))}
      </Defs>
      <G mask="url(#g)">
        <SvgImage
          href={require('@/assets/images/social/google-gradient.png')}
          x={7.26}
          y={6.908}
          width={25.736}
          height={25.772}
          preserveAspectRatio="none"
        />
        {GOOGLE_BLOBS.map(([x, y, , , color, d], i) => (
          <G key={i} transform={`translate(${x} ${y})`} filter={`url(#blur${i})`}>
            <Path d={d} fill={color} />
          </G>
        ))}
      </G>
    </Svg>
  );
}
