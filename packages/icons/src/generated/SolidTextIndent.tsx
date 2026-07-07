import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTextIndent = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 12.373a.751.751 0 0 1-.75.75H10.5a.751.751 0 0 1 0-1.5h9.75a.75.75 0 0 1 .75.75m-10.5-5.25h9.75a.751.751 0 0 0 0-1.5H10.5a.751.751 0 0 0 0 1.5m9.75 10.5H3.75a.751.751 0 0 0 0 1.5h16.5a.751.751 0 0 0 0-1.5m-16.787-3.8a.8.8 0 0 0 .433.04.73.73 0 0 0 .385-.21l3.75-3.75a.75.75 0 0 0 .22-.53c0-.1-.02-.19-.058-.28a.7.7 0 0 0-.162-.25l-3.75-3.75a.8.8 0 0 0-.385-.2.74.74 0 0 0-.77.32.7.7 0 0 0-.126.41v7.5a.75.75 0 0 0 .463.7" /></Svg>;
export { SolidTextIndent as ReactComponent };
