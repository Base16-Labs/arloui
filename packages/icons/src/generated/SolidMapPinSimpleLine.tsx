import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMapPinSimpleLine = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 20.625c0 .2-.07.39-.22.53a.75.75 0 0 1-.53.22H3.75a.75.75 0 1 1 0-1.5h7.5v-6.81c-1.31-.19-2.5-.87-3.33-1.9a5.2 5.2 0 0 1-1.15-3.67c.09-1.32.69-2.56 1.66-3.47a5.263 5.263 0 0 1 7.15 0c.97.91 1.57 2.15 1.66 3.47.1 1.32-.31 2.63-1.15 3.67a5.24 5.24 0 0 1-3.34 1.9v6.81h7.5c.2 0 .39.08.53.22.15.14.22.33.22.53" /></Svg>;
export { SolidMapPinSimpleLine as ReactComponent };
