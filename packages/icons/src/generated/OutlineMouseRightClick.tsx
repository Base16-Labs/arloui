import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineMouseRightClick = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M13.5 1.5h-3c-1.59 0-3.12.63-4.24 1.76A5.97 5.97 0 0 0 4.5 7.5v9c0 1.59.63 3.11 1.76 4.24a6.05 6.05 0 0 0 4.24 1.76h3c1.59-.01 3.12-.64 4.24-1.76a5.99 5.99 0 0 0 1.76-4.24v-9c0-1.59-.63-3.12-1.76-4.24A5.97 5.97 0 0 0 13.5 1.5m-.75 6.31 3.7-3.71c.43.38.79.83 1.05 1.33l-4.31 4.32h-.44zm5.23-.73c.01.13.02.28.02.42v2.25h-2.69zM15.13 3.3l-2.38 2.39V3h.75c.56 0 1.11.1 1.63.3M10.5 3h.75v6.75H6V7.5c0-1.2.48-2.34 1.32-3.18C8.16 3.47 9.31 3 10.5 3m3 18h-3c-1.19 0-2.34-.48-3.18-1.32A4.53 4.53 0 0 1 6 16.5v-5.25h12v5.25c0 1.19-.48 2.33-1.32 3.18-.84.84-1.99 1.32-3.18 1.32" /></Svg>;
export { OutlineMouseRightClick as ReactComponent };
