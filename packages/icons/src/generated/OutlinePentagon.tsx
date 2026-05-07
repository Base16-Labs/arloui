import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePentagon = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m21.145 8.95-8.242-6.4-.017-.01A1.5 1.5 0 0 0 12 2.25c-.319 0-.63.1-.887.29l-.017.01-8.242 6.4a1.52 1.52 0 0 0-.535 1.66l3 10.08.006.02a1.51 1.51 0 0 0 1.425 1.04h10.5a1.51 1.51 0 0 0 1.428-1.04l.005-.02 3-10.08a1.525 1.525 0 0 0-.537-1.66m-.902 1.22L17.25 20.25H6.75l-3-10.08-.006-.01.017-.02L12 3.75l8.232 6.39.017.02z" /></Svg>;
export { OutlinePentagon as ReactComponent };
