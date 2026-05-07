import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTrafficCone = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 19.875h-1.72l-5.647-16.24a1.507 1.507 0 0 0-1.416-1.01h-1.934a1.51 1.51 0 0 0-1.416 1.01l-5.65 16.24H2.25a.751.751 0 0 0 0 1.5h19.5a.75.75 0 0 0 0-1.5m-12.803-9.75h6.106l1.566 4.5H7.381zm2.086-6h1.934l1.564 4.5H9.469zm-4.173 12h10.28l1.305 3.75H5.555z" /></Svg>;
export { OutlineTrafficCone as ReactComponent };
