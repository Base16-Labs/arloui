import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineRug = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.75 1.5a.75.75 0 0 0-.75.75v1.5h-3v-1.5a.75.75 0 0 0-1.5 0v1.5h-3v-1.5a.75.75 0 0 0-1.5 0v1.5H6v-1.5a.75.75 0 0 0-1.5 0v19.5a.75.75 0 0 0 1.5 0v-1.5h3v1.5a.75.75 0 0 0 1.5 0v-1.5h3v1.5a.75.75 0 0 0 1.5 0v-1.5h3v1.5a.75.75 0 0 0 1.5 0V2.25a.75.75 0 0 0-.75-.75M6 5.25h12v13.5H6zm6 11.25c.13 0 .26-.04.37-.1a.64.64 0 0 0 .27-.27l2.25-3.75a.73.73 0 0 0 0-.77l-2.25-3.75a.7.7 0 0 0-.27-.26.7.7 0 0 0-.37-.1c-.13 0-.26.03-.37.1-.11.06-.21.15-.27.26l-2.25 3.75a.73.73 0 0 0 0 .77l2.25 3.75c.06.12.16.21.27.27s.24.1.37.1m0-6.79L13.38 12 12 14.29 10.62 12z" /></Svg>;
export { OutlineRug as ReactComponent };
