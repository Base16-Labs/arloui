import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChurch = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.39 14.735 18 12.705v-1.83a.752.752 0 0 0-.38-.66l-4.87-2.77v-1.82h1.5a.75.75 0 0 0 0-1.5h-1.5v-1.5a.75.75 0 0 0-1.5 0v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.82l-4.87 2.78c-.12.06-.22.16-.28.28-.07.11-.1.24-.1.37v1.83l-3.39 2.03c-.11.06-.2.16-.26.27-.07.11-.1.24-.1.37v6a.75.75 0 0 0 .75.75h7.5a.75.75 0 0 0 .75-.75v-4.5a.75.75 0 0 1 1.5 0v4.5a.75.75 0 0 0 .75.75H21a.75.75 0 0 0 .75-.75v-6c0-.13-.03-.26-.1-.37a.7.7 0 0 0-.26-.27m-17.64 1.06L6 14.445v6.18H3.75zm8.25-1.17c-.6 0-1.17.24-1.59.66s-.66.99-.66 1.59v3.75H7.5v-9.31l4.5-2.58 4.5 2.58v9.31h-2.25v-3.75c0-.6-.24-1.17-.66-1.59s-.99-.66-1.59-.66m8.25 6H18v-6.18l2.25 1.35z" /></Svg>;
export { OutlineChurch as ReactComponent };
export { OutlineChurch };
export default OutlineChurch;
