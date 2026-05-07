import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCircle = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 12c0 1.93-.57 3.81-1.64 5.42a9.8 9.8 0 0 1-4.38 3.59c-1.78.74-3.74.93-5.63.55a9.65 9.65 0 0 1-4.99-2.67 9.65 9.65 0 0 1-2.67-4.99c-.38-1.89-.19-3.85.55-5.63a9.8 9.8 0 0 1 3.59-4.38 9.75 9.75 0 0 1 12.31 1.22A9.75 9.75 0 0 1 21.75 12" /></Svg>;
export { SolidCircle as ReactComponent };
