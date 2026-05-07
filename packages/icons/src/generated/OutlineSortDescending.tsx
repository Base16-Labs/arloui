import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSortDescending = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M3 12.75a.751.751 0 0 1 .75-.75h6.75a.751.751 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75m.75-5.25H9A.751.751 0 0 0 9 6H3.75a.751.751 0 0 0 0 1.5M16.5 18H3.75a.751.751 0 0 0 0 1.5H16.5a.751.751 0 0 0 0-1.5m4.281-9.53-3.75-3.75a.64.64 0 0 0-.244-.16.7.7 0 0 0-.574 0 .64.64 0 0 0-.244.16l-3.75 3.75a.75.75 0 0 0 0 1.06.755.755 0 0 0 1.062 0l2.469-2.47v7.19a.751.751 0 0 0 1.5 0V7.06l2.469 2.47a.78.78 0 0 0 .531.22.782.782 0 0 0 .531-.22.75.75 0 0 0 0-1.06" /></Svg>;
export { OutlineSortDescending as ReactComponent };
