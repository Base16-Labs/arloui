import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWallet = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.875 6.75h-15a.751.751 0 0 1 0-1.5h12.75a.751.751 0 0 0 0-1.5H4.875c-.597 0-1.169.24-1.591.66S2.625 5.4 2.625 6v12c0 .6.237 1.17.659 1.59s.994.66 1.591.66h15c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V8.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-3.375 7.5c-.223 0-.44-.07-.625-.19s-.329-.3-.414-.5a1.133 1.133 0 0 1 .244-1.23c.157-.16.357-.26.576-.31.218-.04.444-.02.65.07a1.11 1.11 0 0 1 .694 1.04 1.126 1.126 0 0 1-1.125 1.12" /></Svg>;
export { SolidWallet as ReactComponent };
