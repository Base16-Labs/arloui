import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCopy = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3h-12a.75.75 0 0 0-.75.75V7.5H3.75a.75.75 0 0 0-.75.75v12a.751.751 0 0 0 .75.75h12a.75.75 0 0 0 .75-.75V16.5h3.75a.75.75 0 0 0 .75-.75v-12a.751.751 0 0 0-.75-.75m-.75 12h-3V8.25a.751.751 0 0 0-.75-.75H9v-3h10.5z" /></Svg>;
export { SolidCopy as ReactComponent };
export { SolidCopy };
export default SolidCopy;
