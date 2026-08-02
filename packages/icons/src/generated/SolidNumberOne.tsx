import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNumberOne = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.75 2.25H5.25c-.398 0-.779.15-1.061.44-.281.28-.439.66-.439 1.06v16.5c0 .39.158.78.439 1.06s.663.44 1.061.44h13.5c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06V3.75c0-.4-.158-.78-.439-1.06a1.47 1.47 0 0 0-1.061-.44m-5.25 15a.751.751 0 0 1-1.5 0V7.96l-1.914.96a.7.7 0 0 1-.283.07.7.7 0 0 1-.29-.03.7.7 0 0 1-.255-.15.742.742 0 0 1-.22-.8.9.9 0 0 1 .145-.26 1 1 0 0 1 .231-.18l3-1.5a.8.8 0 0 1 .37-.07c.127 0 .252.04.36.11.109.07.199.16.261.27a.76.76 0 0 1 .095.37z" /></Svg>;
export { SolidNumberOne as ReactComponent };
export { SolidNumberOne };
export default SolidNumberOne;
