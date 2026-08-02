import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBook = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3v15a.751.751 0 0 1-.75.75H6.75c-.398 0-.78.16-1.06.44-.282.28-.44.66-.44 1.06H18a.751.751 0 0 1 0 1.5H4.5a.753.753 0 0 1-.75-.75V5.25c0-.8.316-1.56.879-2.12a2.97 2.97 0 0 1 2.121-.88H19.5a.75.75 0 0 1 .75.75" /></Svg>;
export { SolidBook as ReactComponent };
export { SolidBook };
export default SolidBook;
