// react-native-svg에 className의 글자색(text-*)을 color prop으로 넘겨,
// 도형에서 fill="currentColor" / stroke="currentColor"로 토큰 색을 쓸 수 있게 한다.
import { cssInterop } from 'nativewind';
import Svg from 'react-native-svg';

cssInterop(Svg, {
  className: { target: 'style', nativeStyleToProp: { color: true } },
});

export { Svg };
