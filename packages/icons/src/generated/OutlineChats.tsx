import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChats = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 7.125h-3v-3a1.5 1.5 0 0 0-1.5-1.5h-12a1.5 1.5 0 0 0-1.5 1.5v12c0 .14.04.28.12.4.07.12.18.21.31.27.12.06.27.09.41.07s.27-.07.38-.16l3.28-2.65v2.82a1.5 1.5 0 0 0 1.5 1.5h8.77l3.51 2.83c.13.11.3.17.47.17a.75.75 0 0 0 .75-.75v-12a1.5 1.5 0 0 0-1.5-1.5m-14.01 5.41-2.49 2.02V4.125h12v8.25H6.71c-.17 0-.34.06-.47.16m14.01 6.52-2.49-2.02c-.13-.1-.3-.16-.47-.16H8.25v-3h7.5a1.5 1.5 0 0 0 1.5-1.5v-3.75h3z" /></Svg>;
export { OutlineChats as ReactComponent };
export { OutlineChats };
export default OutlineChats;
