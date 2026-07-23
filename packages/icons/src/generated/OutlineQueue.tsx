import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineQueue = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M1.875 5.625a.751.751 0 0 1 .75-.75h16.5a.751.751 0 0 1 0 1.5h-16.5a.75.75 0 0 1-.75-.75m9.75 5.25h-9a.751.751 0 0 0 0 1.5h9a.751.751 0 0 0 0-1.5m0 6h-9a.751.751 0 0 0 0 1.5h9a.751.751 0 0 0 0-1.5m10.5-2.25q0 .195-.094.36a.7.7 0 0 1-.258.27l-6 3.75a.84.84 0 0 1-.378.12.74.74 0 0 1-.383-.1.74.74 0 0 1-.387-.65v-7.5a.768.768 0 0 1 .387-.66.84.84 0 0 1 .383-.09c.134 0 .264.04.378.11l6 3.75c.107.07.196.16.258.27.062.12.094.24.094.37m-2.165 0-3.835-2.4v4.8z" /></Svg>;
export { OutlineQueue as ReactComponent };
