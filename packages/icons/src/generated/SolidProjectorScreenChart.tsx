import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidProjectorScreenChart = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 4.5V3a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 3v1.5A1.5 1.5 0 0 0 3.75 6v9H3a.75.75 0 0 0 0 1.5h8.25v1.63c-.5.17-.92.52-1.19.98s-.37 1-.28 1.52.36 1 .77 1.34.92.53 1.45.53 1.04-.19 1.45-.53a2.24 2.24 0 0 0 .49-2.86 2.2 2.2 0 0 0-1.19-.98V16.5H21a.75.75 0 0 0 0-1.5h-.75V6a1.5 1.5 0 0 0 1.5-1.5m-12 7.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0zM12 21c-.15 0-.29-.05-.42-.13a.72.72 0 0 1-.27-.33.83.83 0 0 1-.05-.44c.03-.14.1-.28.21-.38a.72.72 0 0 1 .82-.16c.13.05.25.15.33.27A.75.75 0 0 1 12 21m.75-9a.75.75 0 0 1-1.5 0V9.75a.75.75 0 0 1 1.5 0zm3 0a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 1.5 0zm-12-7.5V3h16.5v1.5z" /></Svg>;
export { SolidProjectorScreenChart as ReactComponent };
export { SolidProjectorScreenChart };
export default SolidProjectorScreenChart;
