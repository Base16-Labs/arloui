import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidArchive = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 4.5H3A1.504 1.504 0 0 0 1.5 6v2.25A1.5 1.5 0 0 0 3 9.75V18a1.5 1.5 0 0 0 1.5 1.5h15A1.503 1.503 0 0 0 21 18V9.75a1.503 1.503 0 0 0 1.5-1.5V6A1.5 1.5 0 0 0 21 4.5m-6.75 9h-4.5a.75.75 0 1 1 0-1.5h4.5a.75.75 0 0 1 0 1.5M21 8.25H3V6h18z" /></Svg>;
export { SolidArchive as ReactComponent };
export { SolidArchive };
export default SolidArchive;
