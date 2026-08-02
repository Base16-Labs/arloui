import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWatch = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m16.43 5.96-.58-3.23c-.06-.34-.25-.66-.51-.88-.27-.23-.61-.35-.97-.35H9.63c-.35 0-.7.12-.96.35-.27.22-.46.54-.52.88l-.58 3.23c-.95.69-1.73 1.6-2.26 2.65A7.5 7.5 0 0 0 4.5 12c0 1.18.28 2.34.81 3.39a7.4 7.4 0 0 0 2.26 2.65l.58 3.23c.06.34.25.66.52.88.26.23.61.35.96.35h4.74c.36 0 .7-.12.97-.35.26-.22.45-.54.51-.88l.58-3.23c.95-.69 1.73-1.6 2.26-2.65s.81-2.21.81-3.39-.28-2.34-.81-3.39a7.4 7.4 0 0 0-2.26-2.65M9.63 3h4.74l.37 2.02a7.5 7.5 0 0 0-5.48 0zm4.74 18H9.63l-.37-2.02c1.76.69 3.72.69 5.48 0zm1.38-8.25H12a.75.75 0 0 1-.75-.75V8.25a.75.75 0 0 1 1.5 0v3h3a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidWatch as ReactComponent };
export { SolidWatch };
export default SolidWatch;
