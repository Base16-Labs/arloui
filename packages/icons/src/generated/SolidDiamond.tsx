import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDiamond = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.497 12q0 .3-.113.57c-.075.18-.186.35-.325.49l-9.004 9c-.282.28-.662.44-1.058.44a1.5 1.5 0 0 1-1.057-.44l-9-9c-.28-.28-.437-.66-.437-1.06s.157-.78.437-1.06l9.004-9a1.5 1.5 0 0 1 1.058-.44 1.5 1.5 0 0 1 1.057.44l9.005 9c.138.14.248.31.322.49q.113.27.111.57" /></Svg>;
export { SolidDiamond as ReactComponent };
