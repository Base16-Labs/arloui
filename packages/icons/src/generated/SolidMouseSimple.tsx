import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMouseSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M13.5 1.5h-3c-1.59 0-3.12.63-4.24 1.76A5.97 5.97 0 0 0 4.5 7.5v9c0 1.59.63 3.11 1.76 4.24a6.05 6.05 0 0 0 4.24 1.76h3c1.59-.01 3.12-.64 4.24-1.76a5.99 5.99 0 0 0 1.76-4.24v-9c0-1.59-.63-3.12-1.76-4.24A5.97 5.97 0 0 0 13.5 1.5m-.75 9a.75.75 0 0 1-1.5 0V6a.75.75 0 0 1 1.5 0z" /></Svg>;
export { SolidMouseSimple as ReactComponent };
