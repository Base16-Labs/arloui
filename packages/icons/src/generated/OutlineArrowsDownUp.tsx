import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineArrowsDownUp = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M11.03 15.97c.07.07.13.152.16.243a.7.7 0 0 1 0 .575.6.6 0 0 1-.16.242l-3 3a.74.74 0 0 1-.53.22.735.735 0 0 1-.53-.22l-3-3a.6.6 0 0 1-.16-.242.71.71 0 0 1 0-.575.75.75 0 0 1 1.22-.244l1.72 1.722V4.5a.751.751 0 0 1 1.5 0v13.19l1.72-1.721a.8.8 0 0 1 .24-.164.77.77 0 0 1 .58 0q.135.06.24.164m9-9-3-3a.8.8 0 0 0-.24-.163.77.77 0 0 0-.58 0 .8.8 0 0 0-.24.163l-3 3a.751.751 0 0 0 1.06 1.061l1.72-1.72V19.5a.751.751 0 0 0 1.5 0V6.31l1.72 1.72a.745.745 0 0 0 1.06 0 .75.75 0 0 0 0-1.062" /></Svg>;
export { OutlineArrowsDownUp as ReactComponent };
export { OutlineArrowsDownUp };
export default OutlineArrowsDownUp;
