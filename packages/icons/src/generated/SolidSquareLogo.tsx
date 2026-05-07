import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSquareLogo = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.78.16-1.06.44C3.157 3.72 3 4.1 3 4.5v15A1.506 1.506 0 0 0 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3m0 16.5h-15v-15h15zM15.75 9v6a.751.751 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75V9A.751.751 0 0 1 9 8.25h6a.75.75 0 0 1 .75.75" /></Svg>;
export { SolidSquareLogo as ReactComponent };
