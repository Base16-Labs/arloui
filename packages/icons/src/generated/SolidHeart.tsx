import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidHeart = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 8.815c0 6.56-9.73 11.87-10.145 12.09a.73.73 0 0 1-.355.09.73.73 0 0 1-.355-.09C11.23 20.685 1.5 15.375 1.5 8.815a5.83 5.83 0 0 1 1.704-4.11 5.8 5.8 0 0 1 4.109-1.7c1.935 0 3.63.83 4.687 2.24 1.057-1.41 2.752-2.24 4.688-2.24 1.541 0 3.018.61 4.108 1.7a5.83 5.83 0 0 1 1.704 4.11" /></Svg>;
export { SolidHeart as ReactComponent };
