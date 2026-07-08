import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidImageSquare = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.78.15-1.06.44C3.157 3.72 3 4.1 3 4.5v15A1.506 1.506 0 0 0 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.89 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 19.5 3m-15 1.5h15v7.25l-2.315-2.32a1.5 1.5 0 0 0-1.06-.43c-.398 0-.779.15-1.06.43L5.003 19.5H4.5zm3 4.5c0-.3.088-.59.253-.84.165-.24.399-.44.673-.55s.576-.14.867-.09c.291.06.558.21.768.42.209.2.352.47.41.76s.028.6-.085.87a1.5 1.5 0 0 1-.553.67c-.246.17-.536.26-.833.26-.398 0-.779-.16-1.06-.44A1.5 1.5 0 0 1 7.5 9" /></Svg>;
export { SolidImageSquare as ReactComponent };
