import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFlashlight = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M17.25 1.5H6.75c-.398 0-.779.16-1.061.44S5.25 2.6 5.25 3v4.25c.001.32.106.64.3.9l1.95 2.6V21c0 .4.158.78.439 1.06s.663.44 1.061.44h6c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V10.75l1.95-2.6c.194-.26.299-.58.3-.9V3c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-4.5 12.75a.751.751 0 0 1-1.5 0v-3a.751.751 0 0 1 1.5 0zm-6-9V3h10.5v2.25z" /></Svg>;
export { SolidFlashlight as ReactComponent };
export { SolidFlashlight };
export default SolidFlashlight;
