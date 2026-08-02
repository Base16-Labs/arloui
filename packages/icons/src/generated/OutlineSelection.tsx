import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSelection = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M14.25 3.75a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75M13.5 19.5h-3a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5m6-16.5h-2.25a.75.75 0 0 0 0 1.5h2.25v2.25a.75.75 0 0 0 1.5 0V4.5A1.5 1.5 0 0 0 19.5 3m.75 6.75a.75.75 0 0 0-.75.75v3a.75.75 0 0 0 1.5 0v-3a.75.75 0 0 0-.75-.75m0 6.75a.75.75 0 0 0-.75.75v2.25h-2.25a.75.75 0 0 0 0 1.5h2.25a1.5 1.5 0 0 0 1.5-1.5v-2.25a.75.75 0 0 0-.75-.75m-16.5-2.25a.75.75 0 0 0 .75-.75v-3a.75.75 0 0 0-1.5 0v3a.75.75 0 0 0 .75.75m3 5.25H4.5v-2.25a.75.75 0 0 0-1.5 0v2.25A1.5 1.5 0 0 0 4.5 21h2.25a.75.75 0 0 0 0-1.5m0-16.5H4.5A1.499 1.499 0 0 0 3 4.5v2.25a.75.75 0 0 0 1.5 0V4.5h2.25a.75.75 0 0 0 0-1.5" /></Svg>;
export { OutlineSelection as ReactComponent };
export { OutlineSelection };
export default OutlineSelection;
