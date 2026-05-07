import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineVibrate = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M15 3H9c-.597 0-1.169.24-1.591.66s-.659.99-.659 1.59v13.5c0 .6.237 1.17.659 1.59S8.403 21 9 21h6c.597 0 1.169-.24 1.591-.66s.659-.99.659-1.59V5.25c0-.6-.237-1.17-.659-1.59A2.26 2.26 0 0 0 15 3m.75 15.75a.751.751 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75V5.25A.751.751 0 0 1 9 4.5h6a.75.75 0 0 1 .75.75zm4.5-10.5v7.5a.751.751 0 0 1-1.5 0v-7.5a.751.751 0 0 1 1.5 0m3 1.5v4.5a.751.751 0 0 1-1.5 0v-4.5a.751.751 0 0 1 1.5 0m-18-1.5v7.5a.751.751 0 0 1-1.5 0v-7.5a.751.751 0 0 1 1.5 0m-3 1.5v4.5a.751.751 0 0 1-1.5 0v-4.5a.751.751 0 0 1 1.5 0" /></Svg>;
export { OutlineVibrate as ReactComponent };
