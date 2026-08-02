import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPaintRoller = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M23.25 8.25v4.68a1.502 1.502 0 0 1-1.088 1.45l-9.412 2.68v3.19a.751.751 0 0 1-1.5 0v-3.19a1.502 1.502 0 0 1 1.088-1.44l9.412-2.69V8.25h-1.5v2.25c0 .39-.158.78-.439 1.06s-.663.44-1.061.44H4.5c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 3 10.5V8.25H1.5a.751.751 0 0 1 0-1.5H3V4.5c0-.4.158-.78.439-1.06C3.721 3.15 4.102 3 4.5 3h14.25c.398 0 .779.15 1.061.44.281.28.439.66.439 1.06v2.25h1.5c.398 0 .779.15 1.061.44.281.28.439.66.439 1.06" /></Svg>;
export { SolidPaintRoller as ReactComponent };
export { SolidPaintRoller };
export default SolidPaintRoller;
