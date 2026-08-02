import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBook = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 2.25H6.75a2.97 2.97 0 0 0-2.121.88 2.99 2.99 0 0 0-.879 2.12V21a.753.753 0 0 0 .75.75H18a.753.753 0 0 0 .75-.75.753.753 0 0 0-.75-.75H5.25a1.506 1.506 0 0 1 1.5-1.5H19.5a.753.753 0 0 0 .75-.75V3a.753.753 0 0 0-.75-.75m-.75 15h-12c-.527 0-1.044.14-1.5.4V5.25a1.506 1.506 0 0 1 1.5-1.5h12z" /></Svg>;
export { OutlineBook as ReactComponent };
export { OutlineBook };
export default OutlineBook;
