import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidAlignLeft = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.375 14.25V18a1.503 1.503 0 0 1-1.5 1.5H7.125a1.5 1.5 0 0 1-1.5-1.5v-3.75a1.5 1.5 0 0 1 1.5-1.5h12.75a1.5 1.5 0 0 1 1.5 1.5M3.375 3a.75.75 0 0 0-.75.75v16.5a.749.749 0 1 0 1.5 0V3.75a.75.75 0 0 0-.75-.75m3.75 8.25h9a1.5 1.5 0 0 0 1.5-1.5V6a1.503 1.503 0 0 0-1.5-1.5h-9a1.5 1.5 0 0 0-1.5 1.5v3.75a1.5 1.5 0 0 0 1.5 1.5" /></Svg>;
export { SolidAlignLeft as ReactComponent };
