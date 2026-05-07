import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCursorText = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M17.25 19.5a.75.75 0 0 1-.75.75H15c-.58 0-1.16-.13-1.68-.39s-.97-.64-1.32-1.11c-.35.47-.8.85-1.32 1.11s-1.1.39-1.68.39H7.5a.75.75 0 0 1 0-1.5H9c.6 0 1.17-.24 1.59-.66s.66-.99.66-1.59v-3.75h-1.5a.75.75 0 0 1 0-1.5h1.5V7.5c0-.59-.24-1.17-.66-1.59S9.6 5.25 9 5.25H7.5a.75.75 0 0 1 0-1.5H9a3.78 3.78 0 0 1 3 1.5 3.776 3.776 0 0 1 3-1.5h1.5a.75.75 0 0 1 0 1.5H15c-.6 0-1.17.24-1.59.66s-.66 1-.66 1.59v3.75h1.5a.75.75 0 0 1 0 1.5h-1.5v3.75c0 .6.24 1.17.66 1.59s.99.66 1.59.66h1.5a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineCursorText as ReactComponent };
