import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFileText = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.031 7.72-5.25-5.25a.78.78 0 0 0-.531-.22h-9c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v16.5c0 .4.158.78.439 1.06s.663.44 1.061.44h13.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-12c0-.1-.019-.19-.057-.29a.8.8 0 0 0-.162-.24M15 4.81l2.69 2.69H15zm3.75 15.44H5.25V3.75h8.25v4.5a.751.751 0 0 0 .75.75h4.5zm-3-7.5a.751.751 0 0 1-.75.75H9A.751.751 0 0 1 9 12h6a.75.75 0 0 1 .75.75m0 3a.751.751 0 0 1-.75.75H9A.751.751 0 0 1 9 15h6a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineFileText as ReactComponent };
export { OutlineFileText };
export default OutlineFileText;
