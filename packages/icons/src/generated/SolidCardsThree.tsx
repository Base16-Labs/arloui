import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCardsThree = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 10.5v9c0 .4-.158.78-.439 1.06s-.663.44-1.061.44h-15c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 3 19.5v-9c0-.4.158-.78.439-1.06S4.102 9 4.5 9h15c.398 0 .779.16 1.061.44S21 10.1 21 10.5m-15.75-3h13.5a.751.751 0 0 0 0-1.5H5.25a.751.751 0 0 0 0 1.5m1.5-3h10.5a.751.751 0 0 0 0-1.5H6.75a.751.751 0 0 0 0 1.5" /></Svg>;
export { SolidCardsThree as ReactComponent };
