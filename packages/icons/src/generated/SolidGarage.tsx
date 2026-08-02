import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidGarage = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 19.125h-.75v-8.75c0-.25-.061-.49-.177-.71-.117-.22-.285-.4-.49-.54l-8.25-5.5a1.54 1.54 0 0 0-.833-.25c-.296 0-.585.09-.832.25l-8.25 5.5a1.5 1.5 0 0 0-.668 1.25v8.75H1.5a.751.751 0 0 0 0 1.5h21a.751.751 0 0 0 0-1.5m-9.75-6H18v2.25h-5.25zm-1.5 2.25H6v-2.25h5.25zM6 16.875h5.25v2.25H6zm6.75 0H18v2.25h-5.25z" /></Svg>;
export { SolidGarage as ReactComponent };
export { SolidGarage };
export default SolidGarage;
