import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCheckerboard = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3m-1.19 8.25-5.56-5.56V4.5h1.19l5.56 5.56v1.19zm-5.56-3.44 3.44 3.44h-3.44zm6.75.13L16.06 4.5h3.44zM11.25 4.5v6.75H4.5V4.5zm-1.19 15L4.5 13.94v-1.19h1.19l5.56 5.56v1.19zm1.19-3.31-3.44-3.44h3.44zm-6.75-.13 3.44 3.44H4.5zm15 3.44h-6.75v-6.75h6.75z" /></Svg>;
export { OutlineCheckerboard as ReactComponent };
export { OutlineCheckerboard };
export default OutlineCheckerboard;
