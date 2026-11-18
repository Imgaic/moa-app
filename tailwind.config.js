/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      // 피그마 최종UI의 Foundation (2026-11-17 기준). 디자인이 완성 전이라 값이 바뀔 수 있다.
      colors: {
        gray: {
          10: '#F1F1F1',
          20: '#DEDEDE',
          30: '#ADADAD',
          40: '#6B6B6B',
          50: '#303030',
          60: '#1C1C1C',
        },
        blue: {
          10: '#E6EFFF',
          30: '#8DB9FF',
          40: '#4E93FF',
          50: '#0063FF',
        },
        white: '#FFFFFF',
        black: '#000000',
        red: '#AF2E36',
        yellow: '#EDC112',
        kakao: {
          DEFAULT: '#FEE500',
          logo: '#191919',
        },
        naver: '#03A94D',
        google: '#FFFFFF',
      },
      fontFamily: {
        pretendard: ['Pretendard'],
      },
      // 피그마 최종UI의 Foundation 글자 스타일 (2026-11-17 기준). [크기, 줄 높이]
      // 줄 높이는 크기 × 1.2를 올림한 값이다. 피그마는 100%지만 iOS에서 1.0은 악센트(Á)가 잘리고 1.1~1.15는 위쪽 경계에 닿았다.
      fontSize: {
        h1: ['32px', { lineHeight: '39px' }],
        h2: ['28px', { lineHeight: '34px' }],
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
