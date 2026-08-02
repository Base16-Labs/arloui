import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidQuestionMark = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.75 2.25H5.25c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v16.5c0 .4.158.78.439 1.06s.663.44 1.061.44h13.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V3.75c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-6 11.18v.07a.751.751 0 0 1-1.5 0v-.75A.751.751 0 0 1 12 12c1.24 0 2.25-.85 2.25-1.88S13.24 8.25 12 8.25s-2.25.84-2.25 1.87v.38a.751.751 0 0 1-1.5 0v-.38c0-1.86 1.682-3.37 3.75-3.37s3.75 1.51 3.75 3.37c0 1.63-1.291 3-3 3.31m.375 3.44a1.112 1.112 0 0 1-.694 1.04c-.206.09-.432.11-.65.07a1.15 1.15 0 0 1-.576-.31 1.13 1.13 0 0 1-.244-1.23c.085-.2.229-.38.414-.5a1.127 1.127 0 0 1 1.75.93" /></Svg>;
export { SolidQuestionMark as ReactComponent };
export { SolidQuestionMark };
export default SolidQuestionMark;
