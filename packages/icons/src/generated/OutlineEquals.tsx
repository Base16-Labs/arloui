import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineEquals = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 15c0 .2-.079.39-.22.54a.74.74 0 0 1-.53.21H3.75a.74.74 0 0 1-.53-.21A.79.79 0 0 1 3 15c0-.19.079-.38.22-.53.14-.14.331-.22.53-.22h16.5c.199 0 .39.08.53.22.141.15.22.34.22.53M3.75 9.75h16.5c.199 0 .39-.07.53-.21.141-.15.22-.34.22-.54 0-.19-.079-.38-.22-.53a.75.75 0 0 0-.53-.22H3.75c-.199 0-.39.08-.53.22A.78.78 0 0 0 3 9c0 .2.079.39.22.54.14.14.331.21.53.21" /></Svg>;
export { OutlineEquals as ReactComponent };
