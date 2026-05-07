import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPepper = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M16.81 4.54a3.73 3.73 0 0 0-1.297-2.18 3.72 3.72 0 0 0-2.386-.86.751.751 0 0 0 0 1.5c.476 0 .941.15 1.326.43s.671.67.816 1.13a6.005 6.005 0 0 0-5.142 5.94c0 4.38-2.414 7.31-7.175 8.72a1.494 1.494 0 0 0-.699 2.43c.226.26.531.43.865.48 1.41.25 2.837.37 4.267.37 3.823 0 8.077-.86 11.018-3.33 2.472-2.07 3.724-4.99 3.724-8.67a6 6 0 0 0-1.525-4c-.98-1.1-2.33-1.8-3.793-1.96m2.317 5.11-2.664-1.33a.8.8 0 0 0-.336-.08.8.8 0 0 0-.336.08l-2.664 1.33-1.253-.62c.305-.89.88-1.66 1.642-2.2a4.52 4.52 0 0 1 5.222 0 4.47 4.47 0 0 1 1.642 2.2z" /></Svg>;
export { SolidPepper as ReactComponent };
