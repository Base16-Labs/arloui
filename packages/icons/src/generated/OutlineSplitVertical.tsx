import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSplitVertical = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 14.25a.75.75 0 0 1-.75.75h-6.75v4.94l1.72-1.72a.75.75 0 1 1 1.06 1.06l-3 3c-.07.07-.15.13-.24.16a.72.72 0 0 1-.58 0 .6.6 0 0 1-.24-.16l-3-3a.75.75 0 1 1 1.06-1.06l1.72 1.72V15H4.5a.75.75 0 0 1 0-1.5h15a.75.75 0 0 1 .75.75M4.5 10.5h15a.75.75 0 0 0 0-1.5h-6.75V4.06l1.72 1.72a.75.75 0 1 0 1.06-1.06l-3-3A.78.78 0 0 0 12 1.5a.776.776 0 0 0-.53.22l-3 3a.75.75 0 1 0 1.06 1.06l1.72-1.72V9H4.5a.75.75 0 0 0 0 1.5" /></Svg>;
export { OutlineSplitVertical as ReactComponent };
