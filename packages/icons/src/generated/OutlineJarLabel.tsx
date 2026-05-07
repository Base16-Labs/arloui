import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineJarLabel = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M17.25 4.57V3c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44h-7.5c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v1.57c-.84.18-1.6.64-2.15 1.31a3.7 3.7 0 0 0-.85 2.37v10.5c0 .99.4 1.94 1.1 2.65.7.7 1.66 1.1 2.65 1.1h9c1 0 1.95-.4 2.65-1.1a3.74 3.74 0 0 0 1.1-2.65V8.25c0-.87-.3-1.71-.84-2.37a3.8 3.8 0 0 0-2.16-1.31m-12 5.93h13.5v6H5.25zm10.5-6h-1.5V3h1.5zm-4.5 0V3h1.5v1.5zM9.75 3v1.5h-1.5V3zM7.5 6h9a2.24 2.24 0 0 1 2.25 2.25V9H5.25v-.75c0-.6.24-1.17.66-1.6.42-.42 1-.65 1.59-.65m9 15h-9c-.59 0-1.17-.24-1.59-.66-.42-.43-.66-1-.66-1.59V18h13.5v.75c0 .59-.23 1.16-.66 1.59-.42.42-.99.66-1.59.66" /></Svg>;
export { OutlineJarLabel as ReactComponent };
