import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidShoppingBag = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v13.5c0 .4.158.78.439 1.06s.663.44 1.061.44h16.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-8.25 9a4.47 4.47 0 0 1-3.181-1.32A4.5 4.5 0 0 1 7.5 8.25a.751.751 0 0 1 1.5 0c0 .8.316 1.56.879 2.12a3 3 0 0 0 2.121.88 3 3 0 0 0 2.121-.88c.563-.56.879-1.32.879-2.12a.751.751 0 0 1 1.5 0 4.5 4.5 0 0 1-1.319 3.18A4.47 4.47 0 0 1 12 12.75" /></Svg>;
export { SolidShoppingBag as ReactComponent };
