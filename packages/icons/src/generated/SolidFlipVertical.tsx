import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFlipVertical = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M4.5 11.25h15c.345 0 .681-.12.95-.34a1.494 1.494 0 0 0 .376-1.86 1.46 1.46 0 0 0-.743-.68l-.013-.01-14.993-6a1.6 1.6 0 0 0-.723-.11c-.246.03-.482.11-.688.25s-.374.32-.49.54a1.5 1.5 0 0 0-.177.71v6c0 .4.158.78.44 1.06.281.28.662.44 1.06.44m0-7.5.013.01L19.5 9.75h-15zm16.468 10.2a1.48 1.48 0 0 1-.886 1.68l-.013.01-14.993 6c-.229.09-.477.13-.723.11a1.54 1.54 0 0 1-.687-.25 1.5 1.5 0 0 1-.49-.54 1.5 1.5 0 0 1-.177-.71v-6c0-.4.158-.78.44-1.06.281-.28.662-.44 1.06-.44h15a1.5 1.5 0 0 1 1.47 1.2" /></Svg>;
export { SolidFlipVertical as ReactComponent };
