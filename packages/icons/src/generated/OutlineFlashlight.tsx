import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFlashlight = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M17.25 1.5H6.75c-.398 0-.779.16-1.061.44S5.25 2.6 5.25 3v4.25c.001.32.106.64.3.9l1.95 2.6V21c0 .4.158.78.439 1.06s.663.44 1.061.44h6c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V10.75l1.95-2.6c.194-.26.299-.58.3-.9V3c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M6.75 3h10.5v2.25H6.75zm8.55 6.85c-.194.26-.299.58-.3.9V21H9V10.75a1.52 1.52 0 0 0-.3-.9l-1.95-2.6v-.5h10.5v.5zm-2.55 1.4v3a.751.751 0 0 1-1.5 0v-3a.751.751 0 0 1 1.5 0" /></Svg>;
export { OutlineFlashlight as ReactComponent };
