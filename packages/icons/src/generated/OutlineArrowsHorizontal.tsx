import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineArrowsHorizontal = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m22.28 12.53-3 3a.745.745 0 0 1-1.06 0 .75.75 0 0 1 0-1.06l1.72-1.72H4.06l1.72 1.72a.751.751 0 0 1-1.06 1.061l-3-3a.6.6 0 0 1-.16-.244.71.71 0 0 1 0-.574.64.64 0 0 1 .16-.243l3-3a.75.75 0 1 1 1.06 1.06l-1.72 1.72h15.88l-1.72-1.72a.751.751 0 0 1 1.06-1.06l3 3c.07.07.13.152.16.243a.7.7 0 0 1 0 .575.6.6 0 0 1-.16.242" /></Svg>;
export { OutlineArrowsHorizontal as ReactComponent };
