import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSubsetOf = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3m-3 14.25h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 0 1.5m-6-4.5h6a.75.75 0 0 1 0 1.5h-6c-.99 0-1.95-.39-2.65-1.1-.7-.7-1.1-1.65-1.1-2.65 0-.99.4-1.95 1.1-2.65s1.66-1.1 2.65-1.1h6a.75.75 0 0 1 0 1.5h-6c-.6 0-1.17.24-1.59.66a2.248 2.248 0 0 0 1.59 3.84" /></Svg>;
export { SolidSubsetOf as ReactComponent };
