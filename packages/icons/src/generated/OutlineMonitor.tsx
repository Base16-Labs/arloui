import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineMonitor = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.6 0-1.17.23-1.59.66-.42.42-.66.99-.66 1.59v10.5c0 .59.24 1.17.66 1.59S3.9 18 4.5 18h15c.6 0 1.17-.24 1.59-.66s.66-1 .66-1.59V5.25c0-.6-.24-1.17-.66-1.59-.42-.43-.99-.66-1.59-.66m.75 12.75a.75.75 0 0 1-.75.75h-15a.75.75 0 0 1-.75-.75V5.25a.75.75 0 0 1 .75-.75h15a.75.75 0 0 1 .75.75zm-4.5 4.5A.75.75 0 0 1 15 21H9a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineMonitor as ReactComponent };
export { OutlineMonitor };
export default OutlineMonitor;
