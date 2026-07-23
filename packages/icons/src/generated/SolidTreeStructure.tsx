import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTreeStructure = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M14.625 9V7.5h-1.5a.75.75 0 0 0-.75.75v7.5a.75.75 0 0 0 .75.75h1.5V15a1.5 1.5 0 0 1 1.5-1.5h4.5a1.5 1.5 0 0 1 1.5 1.5v4.5a1.5 1.5 0 0 1-1.5 1.5h-4.5a1.5 1.5 0 0 1-1.5-1.5V18h-1.5c-.6 0-1.17-.23-1.59-.66-.42-.42-.66-.99-.66-1.59v-3h-3v.75a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v.75h3v-3c0-.59.24-1.17.66-1.59s.99-.66 1.59-.66h1.5V4.5a1.5 1.5 0 0 1 1.5-1.5h4.5a1.5 1.5 0 0 1 1.5 1.5V9a1.5 1.5 0 0 1-1.5 1.5h-4.5a1.5 1.5 0 0 1-1.5-1.5" /></Svg>;
export { SolidTreeStructure as ReactComponent };
