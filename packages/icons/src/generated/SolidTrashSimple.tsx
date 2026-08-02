import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTrashSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 6a.751.751 0 0 1-.75.75h-.75v13.5c0 .4-.158.78-.439 1.06s-.663.44-1.061.44H6c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06V6.75h-.75a.751.751 0 0 1 0-1.5h16.5A.75.75 0 0 1 21 6M8.25 3.75h7.5a.751.751 0 0 0 0-1.5h-7.5a.751.751 0 0 0 0 1.5" /></Svg>;
export { SolidTrashSimple as ReactComponent };
export { SolidTrashSimple };
export default SolidTrashSimple;
