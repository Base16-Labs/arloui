import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidChatText = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3H3.75a1.5 1.5 0 0 0-1.5 1.5v15c0 .28.08.56.23.81a1.523 1.523 0 0 0 1.27.69c.35 0 .69-.13.96-.36h.01L7.78 18h12.47a1.5 1.5 0 0 0 1.5-1.5v-12a1.5 1.5 0 0 0-1.5-1.5M15 12.75H9a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 0 1.5m0-3H9a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidChatText as ReactComponent };
