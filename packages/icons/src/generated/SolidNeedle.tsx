import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNeedle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.9 4.09A3.75 3.75 0 0 0 17.25 3c-.994 0-1.948.39-2.652 1.09l-2.25 2.25a.78.78 0 0 0-.209.41c-.824 4.8-8.764 12.81-8.918 12.96a.8.8 0 0 0-.22.53c0 .2.079.39.22.54a.753.753 0 0 0 1.06 0c.08-.09 8.14-8.1 12.968-8.92.152-.03.294-.1.402-.21l2.25-2.25A3.77 3.77 0 0 0 21 6.75c0-1-.395-1.95-1.099-2.66m-2.12 3.19-1.5 1.5a.751.751 0 0 1-1.061-1.06l1.5-1.5c.14-.15.331-.22.53-.22.2 0 .39.07.532.22a.745.745 0 0 1 0 1.06" /></Svg>;
export { SolidNeedle as ReactComponent };
export { SolidNeedle };
export default SolidNeedle;
