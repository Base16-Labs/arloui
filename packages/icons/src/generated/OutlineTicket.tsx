import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTicket = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 9.75A.75.75 0 0 0 22.5 9V6c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 21 4.5H3c-.398 0-.779.16-1.061.44S1.5 5.6 1.5 6v3a.751.751 0 0 0 .75.75A2.256 2.256 0 0 1 4.5 12c0 .6-.237 1.17-.659 1.59-.422.43-.994.66-1.591.66a.75.75 0 0 0-.75.75v3c0 .4.158.78.439 1.06s.663.44 1.061.44h18c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-3a.751.751 0 0 0-.75-.75c-.597 0-1.169-.23-1.591-.66A2.24 2.24 0 0 1 19.5 12a2.256 2.256 0 0 1 2.25-2.25M3 15.68c.848-.17 1.61-.63 2.157-1.3a3.756 3.756 0 0 0 0-4.75A3.73 3.73 0 0 0 3 8.33V6h5.25v12H3zm18 0V18H9.75V6H21v2.33a3.75 3.75 0 0 0-2.157 6.05A3.73 3.73 0 0 0 21 15.68" /></Svg>;
export { OutlineTicket as ReactComponent };
