import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidQueue = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3M6 6.75h12a.751.751 0 0 1 0 1.5H6a.751.751 0 0 1 0-1.5m3.75 10.5H6a.751.751 0 0 1 0-1.5h3.75a.751.751 0 0 1 0 1.5m0-4.5H6a.751.751 0 0 1 0-1.5h3.75a.751.751 0 0 1 0 1.5m8.666 2.12-4.5 3a.77.77 0 0 1-.416.13.75.75 0 0 1-.75-.75v-6q.001-.21.106-.39c.07-.11.17-.21.29-.27.12-.07.255-.1.39-.09.136.01.267.05.38.12l4.5 3c.103.07.187.17.246.27a.76.76 0 0 1 0 .71.76.76 0 0 1-.246.27" /></Svg>;
export { SolidQueue as ReactComponent };
export { SolidQueue };
export default SolidQueue;
