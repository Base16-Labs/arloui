import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBracketsSquare = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v13.5c0 .4.158.78.439 1.06s.663.44 1.061.44h16.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M9.75 16.5a.751.751 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75V6.75A.751.751 0 0 1 6.75 6h3a.751.751 0 0 1 0 1.5H7.5v9zm8.25.75a.751.751 0 0 1-.75.75h-3a.751.751 0 0 1 0-1.5h2.25v-9h-2.25a.751.751 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75z" /></Svg>;
export { SolidBracketsSquare as ReactComponent };
export { SolidBracketsSquare };
export default SolidBracketsSquare;
