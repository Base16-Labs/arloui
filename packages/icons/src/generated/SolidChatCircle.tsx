import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidChatCircle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 11.998c0 1.68-.435 3.34-1.264 4.8a9.75 9.75 0 0 1-3.466 3.56 9.9 9.9 0 0 1-4.769 1.39 9.8 9.8 0 0 1-4.833-1.14l-3.193 1.06c-.264.09-.548.1-.819.04-.27-.07-.519-.21-.716-.4a1.507 1.507 0 0 1-.362-1.54l1.064-3.19a9.8 9.8 0 0 1-1.136-4.24 9.78 9.78 0 0 1 3.475-7.81 9.8 9.8 0 0 1 3.908-1.99 9.8 9.8 0 0 1 4.385-.08c1.449.31 2.809.94 3.976 1.86a9.7 9.7 0 0 1 2.762 3.4c.649 1.33.987 2.8.988 4.28" /></Svg>;
export { SolidChatCircle as ReactComponent };
