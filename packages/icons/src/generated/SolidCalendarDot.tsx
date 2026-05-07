import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCalendarDot = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3.75h-2.25V3a.751.751 0 0 0-1.5 0v.75h-7.5V3a.751.751 0 0 0-1.5 0v.75H4.5c-.398 0-.779.16-1.061.44S3 4.85 3 5.25v15c0 .4.158.78.439 1.06s.663.44 1.061.44h15c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-15c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M12 16.5c-.297 0-.587-.09-.833-.26a1.44 1.44 0 0 1-.553-.67 1.487 1.487 0 0 1 .325-1.63c.21-.21.477-.36.768-.41.291-.06.593-.03.867.08.274.12.508.31.673.55.165.25.253.54.253.84 0 .4-.158.78-.439 1.06s-.663.44-1.061.44m7.5-8.25h-15v-3h2.25V6a.751.751 0 0 0 1.5 0v-.75h7.5V6a.751.751 0 0 0 1.5 0v-.75h2.25z" /></Svg>;
export { SolidCalendarDot as ReactComponent };
