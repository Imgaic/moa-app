// 시험용(spike/naver-map): 네이버 지도 키를 저장소에 넣지 않으려고 환경 변수에서 읽는다.
// 키가 없으면 빈 값이 들어가고, 지도는 인증 실패(800)로 뜬다.
module.exports = ({ config }) => ({
  ...config,
  plugins: [
    ...config.plugins,
    [
      '@mj-studio/react-native-naver-map',
      { client_id: process.env.NAVER_MAP_CLIENT_ID ?? '' },
    ],
  ],
});
