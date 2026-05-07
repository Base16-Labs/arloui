import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTreeStructure = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M16.125 10.5h4.5a1.5 1.5 0 0 0 1.5-1.5V4.5a1.5 1.5 0 0 0-1.5-1.5h-4.5a1.5 1.5 0 0 0-1.5 1.5V6h-1.5c-.6 0-1.17.24-1.59.66s-.66 1-.66 1.59v3h-3v-.75a1.5 1.5 0 0 0-1.5-1.5h-3a1.5 1.5 0 0 0-1.5 1.5v3a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-.75h3v3c0 .6.24 1.17.66 1.59.42.43.99.66 1.59.66h1.5v1.5a1.5 1.5 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5V15a1.5 1.5 0 0 0-1.5-1.5h-4.5a1.5 1.5 0 0 0-1.5 1.5v1.5h-1.5a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 .75-.75h1.5V9a1.5 1.5 0 0 0 1.5 1.5m-9.75 3h-3v-3h3zm9.75 1.5h4.5v4.5h-4.5zm0-10.5h4.5V9h-4.5z" /></Svg>;
export { OutlineTreeStructure as ReactComponent };
