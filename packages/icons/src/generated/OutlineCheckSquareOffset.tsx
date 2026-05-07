import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCheckSquareOffset = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 4.5v15c0 .4-.158.78-.439 1.06s-.663.44-1.061.44h-6.75a.751.751 0 0 1 0-1.5h6.75v-15h-15v9a.751.751 0 0 1-1.5 0v-9c0-.4.158-.78.439-1.06S4.102 3 4.5 3h15c.398 0 .779.16 1.061.44S21 4.1 21 4.5m-9.219 9.97a.64.64 0 0 0-.244-.16.71.71 0 0 0-.574 0 .64.64 0 0 0-.244.16L6 19.19l-1.719-1.72a.64.64 0 0 0-.244-.16.71.71 0 0 0-.574 0 .748.748 0 0 0-.244 1.22l2.25 2.25c.07.07.153.13.244.16a.7.7 0 0 0 .574 0 .64.64 0 0 0 .244-.16l5.25-5.25a.75.75 0 0 0 0-1.06" /></Svg>;
export { OutlineCheckSquareOffset as ReactComponent };
