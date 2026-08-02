import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidParagraph = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.625 4.5a.75.75 0 0 1-.75.75h-1.5V19.5a.75.75 0 0 1-1.5 0V5.25h-2.25V19.5a.75.75 0 0 1-1.5 0v-3.75h-3.75a6.01 6.01 0 0 1-6-6 5.993 5.993 0 0 1 6-6h10.5a.75.75 0 0 1 .75.75" /></Svg>;
export { SolidParagraph as ReactComponent };
export { SolidParagraph };
export default SolidParagraph;
