import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCrosshairSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.25c-1.928 0-3.813.57-5.417 1.65a9.74 9.74 0 0 0-4.146 10 9.716 9.716 0 0 0 7.661 7.66c1.891.38 3.852.19 5.633-.55a9.8 9.8 0 0 0 4.38-3.59 9.754 9.754 0 0 0-1.219-12.31A9.74 9.74 0 0 0 12 2.25m.75 17.97v-2.97a.751.751 0 0 0-1.5 0v2.97a8.25 8.25 0 0 1-5.08-2.39 8.25 8.25 0 0 1-2.385-5.08H6.75a.751.751 0 0 0 0-1.5H3.785a8.25 8.25 0 0 1 7.465-7.46v2.96a.751.751 0 0 0 1.5 0V3.79a8.24 8.24 0 0 1 5.081 2.38 8.27 8.27 0 0 1 2.39 5.08h-2.97a.751.751 0 0 0 0 1.5h2.97a8.27 8.27 0 0 1-2.39 5.08 8.25 8.25 0 0 1-5.08 2.39" /></Svg>;
export { OutlineCrosshairSimple as ReactComponent };
export { OutlineCrosshairSimple };
export default OutlineCrosshairSimple;
