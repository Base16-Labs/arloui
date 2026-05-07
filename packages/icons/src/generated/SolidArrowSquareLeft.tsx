import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidArrowSquareLeft = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.4 0-.78.158-1.06.439S3 4.102 3 4.5v15c0 .398.16.779.44 1.061S4.1 21 4.5 21h15c.4 0 .78-.158 1.06-.439s.44-.663.44-1.061v-15c0-.398-.16-.779-.44-1.061A1.5 1.5 0 0 0 19.5 3m-3.75 9.75h-5.69l1.72 1.719A.78.78 0 0 1 12 15q0 .149-.06.287a.8.8 0 0 1-.16.244.7.7 0 0 1-.25.162.75.75 0 0 1-.81-.162l-3-3a.8.8 0 0 1-.17-.244A1 1 0 0 1 7.5 12a1 1 0 0 1 .05-.287c.04-.091.1-.174.17-.244l3-3a.75.75 0 0 1 1.06 0 .755.755 0 0 1 0 1.062l-1.72 1.719h5.69a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidArrowSquareLeft as ReactComponent };
