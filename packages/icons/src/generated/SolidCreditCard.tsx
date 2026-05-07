import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCreditCard = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 4.5H3c-.398 0-.779.16-1.061.44S1.5 5.6 1.5 6v12c0 .4.158.78.439 1.06s.663.44 1.061.44h18c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V6c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 21 4.5m-8.25 12h-1.5a.751.751 0 0 1 0-1.5h1.5a.751.751 0 0 1 0 1.5m6 0h-3a.751.751 0 0 1 0-1.5h3a.751.751 0 0 1 0 1.5M3 8.25V6h18v2.25z" /></Svg>;
export { SolidCreditCard as ReactComponent };
