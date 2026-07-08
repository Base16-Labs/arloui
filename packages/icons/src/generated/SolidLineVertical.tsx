import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidLineVertical = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.78.15-1.06.44C3.157 3.72 3 4.1 3 4.5v15A1.506 1.506 0 0 0 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.89 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 19.5 3m-6.75 15a.751.751 0 0 1-1.28.53.76.76 0 0 1-.22-.53V6a.751.751 0 0 1 1.5 0z" /></Svg>;
export { SolidLineVertical as ReactComponent };
