import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidRowsPlusTop = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 18v2.25c0 .4-.158.78-.439 1.06s-.663.44-1.061.44h-15c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 3 20.25V18c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h15c.398 0 .779.16 1.061.44S21 17.6 21 18m-1.5-8.25h-15c-.398 0-.779.16-1.061.44S3 10.85 3 11.25v2.25c0 .4.158.78.439 1.06S4.102 15 4.5 15h15c.398 0 .779-.16 1.061-.44S21 13.9 21 13.5v-2.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M9.75 6h1.5v1.5a.751.751 0 0 0 1.5 0V6h1.5a.751.751 0 0 0 0-1.5h-1.5V3a.751.751 0 0 0-1.5 0v1.5h-1.5a.751.751 0 0 0 0 1.5" /></Svg>;
export { SolidRowsPlusTop as ReactComponent };
export { SolidRowsPlusTop };
export default SolidRowsPlusTop;
