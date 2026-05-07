import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNewspaper = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 4.5H6c-.398 0-.779.15-1.061.44C4.658 5.22 4.5 5.6 4.5 6v11.25a.751.751 0 0 1-1.5 0v-9a.751.751 0 0 0-1.5 0v9.01c.003.59.241 1.16.663 1.58.421.42.992.66 1.587.66h16.5a2.256 2.256 0 0 0 2.25-2.25V6c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 21 4.5m-3.75 9.75h-7.5a.751.751 0 0 1 0-1.5h7.5a.751.751 0 0 1 0 1.5m0-3h-7.5a.751.751 0 0 1 0-1.5h7.5a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidNewspaper as ReactComponent };
