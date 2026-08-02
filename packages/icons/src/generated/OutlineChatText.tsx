import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChatText = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3H3.75a1.5 1.5 0 0 0-1.5 1.5v15c0 .28.08.56.23.8a1.5 1.5 0 0 0 1.27.7c.35 0 .69-.13.96-.36h.01L7.78 18h12.47a1.5 1.5 0 0 0 1.5-1.5v-12a1.5 1.5 0 0 0-1.5-1.5m0 13.5H7.5c-.18 0-.35.06-.49.18L3.75 19.5v-15h16.5zM8.25 9A.75.75 0 0 1 9 8.25h6a.75.75 0 0 1 0 1.5H9A.75.75 0 0 1 8.25 9m0 3a.75.75 0 0 1 .75-.75h6a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75" /></Svg>;
export { OutlineChatText as ReactComponent };
export { OutlineChatText };
export default OutlineChatText;
