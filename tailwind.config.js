/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // docs/architecture.md 6.1 (피그마 변수)
      colors: {
        navy: {
          10: '#D3D6E1',
          20: '#98A0BB',
          30: '#57679B',
          40: '#3B4E8D',
          50: '#1B2F73',
          60: '#000943',
        },
        gray: {
          10: '#F7F7F8',
          20: '#DEDEDE',
          30: '#ABAFBC',
          40: '#535A68',
          50: '#111111',
        },
        white: '#FFFFFF',
        black: '#000000',
        blue: '#2F80FF',
        red: '#AF2E36',
        yellow: '#EDC112',
        kakao: '#FEE500',
        naver: '#03A94D',
        google: '#FFFFFF',
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
      // docs/architecture.md 6.2 (피그마 글자 스타일). [크기, 줄 높이]
      // 줄 높이는 크기 × 1.2를 올림한 값이다. 피그마는 100%지만 iOS에서 1.0은 악센트(Á)가 잘리고 1.1~1.15는 위쪽 경계에 닿았다.
      fontSize: {
        h1: ['32px', { lineHeight: '39px' }],
        h2: ['26px', { lineHeight: '32px' }],
        h3: ['24px', { lineHeight: '29px' }],
        h4: ['20px', { lineHeight: '24px' }],
        body1: ['18px', { lineHeight: '22px' }],
        body2: ['16px', { lineHeight: '20px' }],
        'caption-14': ['14px', { lineHeight: '17px' }],
        'caption-12': ['12px', { lineHeight: '15px' }],
        'caption-9': ['9px', { lineHeight: '11px' }],
      },
    },
  },
  plugins: [],
};
