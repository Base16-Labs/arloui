import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidArrowSquareOut = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18 12.75v6.75c0 .398-.16.779-.44 1.061S16.9 21 16.5 21h-12c-.4 0-.78-.158-1.06-.439A1.5 1.5 0 0 1 3 19.5v-12c0-.398.16-.779.44-1.061S4.1 6 4.5 6h6.75a.751.751 0 0 1 0 1.5H4.5v12h12v-6.75a.751.751 0 0 1 1.5 0m3-9a.75.75 0 0 0-.75-.75h-6a.752.752 0 0 0-.74.896c.03.146.1.28.21.385l2.47 2.469-3.97 3.969a.755.755 0 0 0 0 1.062.75.75 0 0 0 1.06 0l3.97-3.971 2.47 2.471a.74.74 0 0 0 .81.162.73.73 0 0 0 .34-.276.8.8 0 0 0 .13-.417z" /></Svg>;
export { SolidArrowSquareOut as ReactComponent };
