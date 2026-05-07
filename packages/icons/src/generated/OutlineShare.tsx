import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineShare = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m21.53 9.53-4.5 4.5a.755.755 0 0 1-1.062 0 .75.75 0 0 1 0-1.06l3.221-3.22h-3.72a8.26 8.26 0 0 0-7.991 6.19.76.76 0 0 1-.345.46.75.75 0 0 1-.57.08.764.764 0 0 1-.538-.92 9.74 9.74 0 0 1 9.444-7.31h3.723l-3.223-3.22a.748.748 0 0 1 .818-1.22c.09.04.174.09.244.16l4.5 4.5a.75.75 0 0 1 0 1.06M18 18.75H3.75V7.5a.751.751 0 0 0-1.5 0v12a.751.751 0 0 0 .75.75h15a.751.751 0 0 0 0-1.5" /></Svg>;
export { OutlineShare as ReactComponent };
