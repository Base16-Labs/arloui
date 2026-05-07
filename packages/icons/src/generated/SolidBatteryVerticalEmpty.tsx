import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBatteryVerticalEmpty = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M8.25 1.125A.75.75 0 0 1 9 .375h6a.751.751 0 0 1 0 1.5H9a.751.751 0 0 1-.75-.75m10.5 4.5v15.75c0 .597-.24 1.169-.66 1.591s-.99.659-1.59.659h-9c-.6 0-1.17-.237-1.59-.659a2.26 2.26 0 0 1-.66-1.591V5.625c0-.597.24-1.169.66-1.591s.99-.659 1.59-.659h9c.6 0 1.17.237 1.59.659s.66.994.66 1.591m-1.5 0a.75.75 0 0 0-.75-.75h-9a.751.751 0 0 0-.75.75v15.75a.75.75 0 0 0 .75.75h9a.751.751 0 0 0 .75-.75z" /></Svg>;
export { SolidBatteryVerticalEmpty as ReactComponent };
