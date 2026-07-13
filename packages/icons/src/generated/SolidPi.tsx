import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPi = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.15-1.061.44C3.158 3.72 3 4.1 3 4.5v15c0 .39.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.89 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 19.5 3m-3.375 12.75a1.127 1.127 0 0 0 1.125-1.13.751.751 0 0 1 1.5 0 2.625 2.625 0 1 1-5.25 0V9h-3v7.5a.751.751 0 0 1-1.5 0V9h-.75c-.597 0-1.169.23-1.591.66-.422.42-.659.99-.659 1.59a.751.751 0 0 1-1.5 0c0-1 .395-1.95 1.098-2.66A3.76 3.76 0 0 1 8.25 7.5H18A.751.751 0 0 1 18 9h-3v5.62a1.127 1.127 0 0 0 1.125 1.13" /></Svg>;
export { SolidPi as ReactComponent };
