import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDrop = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M16.312 5.23a23.8 23.8 0 0 0-3.885-3.6.8.8 0 0 0-.431-.13.8.8 0 0 0-.43.13 23.8 23.8 0 0 0-3.878 3.6C5.11 8.18 3.75 11.3 3.75 14.25c0 2.19.869 4.29 2.416 5.83a8.244 8.244 0 0 0 11.668 0 8.23 8.23 0 0 0 2.416-5.83c0-2.95-1.36-6.07-3.938-9.02m.924 9.89a5.4 5.4 0 0 1-1.498 2.87c-.78.78-1.781 1.3-2.867 1.5-.04 0-.08.01-.121.01a.75.75 0 0 1-.124-1.49c1.554-.26 2.872-1.58 3.135-3.14a.74.74 0 0 1 .306-.48.74.74 0 0 1 .56-.13.74.74 0 0 1 .614.86z" /></Svg>;
export { SolidDrop as ReactComponent };
export { SolidDrop };
export default SolidDrop;
