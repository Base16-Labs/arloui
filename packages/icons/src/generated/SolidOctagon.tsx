import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidOctagon = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m21.31 7.52-4.832-4.83a1.5 1.5 0 0 0-1.061-.44H8.583c-.398 0-.779.16-1.061.44L2.69 7.52c-.281.28-.439.66-.44 1.06v6.83c.001.4.159.78.44 1.06l4.832 4.84c.282.28.663.43 1.061.44h6.834c.398-.01.779-.16 1.061-.44l4.832-4.84c.281-.28.439-.66.44-1.06V8.58c-.001-.4-.159-.78-.44-1.06" /></Svg>;
export { SolidOctagon as ReactComponent };
