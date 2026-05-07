import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidAlignCenterVertical = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 12c0 .199-.079.39-.22.53a.75.75 0 0 1-.53.22h-1.5v4.5a1.503 1.503 0 0 1-1.5 1.5h-3.75a1.503 1.503 0 0 1-1.5-1.5v-4.5h-1.5v6.75a1.503 1.503 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5v-6.75H3a.749.749 0 0 1-.53-1.28.75.75 0 0 1 .53-.22h1.5V4.5A1.5 1.5 0 0 1 6 3h3.75a1.503 1.503 0 0 1 1.5 1.5v6.75h1.5v-4.5a1.503 1.503 0 0 1 1.5-1.5H18a1.503 1.503 0 0 1 1.5 1.5v4.5H21c.199 0 .39.079.53.22.141.14.22.331.22.53" /></Svg>;
export { SolidAlignCenterVertical as ReactComponent };
