import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePaintRoller = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 6.75h-1.5V4.5c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 18.75 3H4.5c-.398 0-.779.15-1.061.44C3.158 3.72 3 4.1 3 4.5v2.25H1.5a.751.751 0 0 0 0 1.5H3v2.25c0 .39.158.78.439 1.06S4.102 12 4.5 12h14.25c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06V8.25h1.5v4.68l-9.412 2.69a1.5 1.5 0 0 0-.783.54c-.196.26-.303.57-.305.9v3.19a.751.751 0 0 0 1.5 0v-3.19l9.412-2.69c.312-.09.587-.28.783-.54s.303-.57.305-.9V8.25c0-.4-.158-.78-.439-1.06a1.47 1.47 0 0 0-1.061-.44m-3 3.75H4.5v-6h14.25z" /></Svg>;
export { OutlinePaintRoller as ReactComponent };
