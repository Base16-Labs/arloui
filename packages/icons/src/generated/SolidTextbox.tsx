import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTextbox = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M23.25 7.5v9a1.5 1.5 0 0 1-1.5 1.5h-8.62c-.1 0-.2-.04-.27-.11a.36.36 0 0 1-.11-.26V6.38c0-.1.04-.2.11-.27s.17-.11.27-.11h8.62a1.5 1.5 0 0 1 1.5 1.5m-12-3v15a.75.75 0 0 1-1.5 0V18h-7.5a1.5 1.5 0 0 1-1.5-1.5v-9A1.5 1.5 0 0 1 2.25 6h7.5V4.5a.75.75 0 0 1 1.5 0m-3 6a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0 0 1.5h.75v2.25a.75.75 0 0 0 1.5 0v-2.25h.75a.75.75 0 0 0 .75-.75" /></Svg>;
export { SolidTextbox as ReactComponent };
