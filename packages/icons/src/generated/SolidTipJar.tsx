import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTipJar = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M17.25 4.58V3a1.5 1.5 0 0 0-1.5-1.5h-7.5A1.5 1.5 0 0 0 6.75 3v1.58c-.85.17-1.61.63-2.15 1.3a3.74 3.74 0 0 0-.85 2.37v10.5c0 1 .4 1.95 1.1 2.65.7.71 1.66 1.1 2.65 1.1h9c.99 0 1.95-.39 2.65-1.1.7-.7 1.1-1.65 1.1-2.65V8.25c0-.86-.3-1.7-.85-2.37-.54-.67-1.3-1.13-2.15-1.3m-6-1.58h1.5v1.5h-1.5zm-3 0h1.5v1.5h-1.5zm4.5 14.25V18a.75.75 0 0 1-1.5 0v-.75h-.75a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 0 0-1.5h-1.5c-.6 0-1.17-.23-1.59-.66a2.248 2.248 0 0 1 1.59-3.84V9a.75.75 0 0 1 1.5 0v.75h.75a.75.75 0 0 1 0 1.5h-2.25a.75.75 0 0 0 0 1.5h1.5c.6 0 1.17.24 1.59.66s.66 1 .66 1.59c0 .6-.24 1.17-.66 1.59-.42.43-.99.66-1.59.66m3-12.75h-1.5V3h1.5z" /></Svg>;
export { SolidTipJar as ReactComponent };
