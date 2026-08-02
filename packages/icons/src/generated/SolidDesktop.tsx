import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDesktop = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15a2.256 2.256 0 0 0-2.25 2.25v10.5c0 .6.237 1.17.659 1.59S3.903 18 4.5 18h6.75v1.5H9A.751.751 0 0 0 9 21h6a.751.751 0 0 0 0-1.5h-2.25V18h6.75c.597 0 1.169-.24 1.591-.66s.659-.99.659-1.59V5.25A2.256 2.256 0 0 0 19.5 3m0 13.5h-15a.75.75 0 0 1-.75-.75v-1.5h16.5v1.5a.751.751 0 0 1-.75.75" /></Svg>;
export { SolidDesktop as ReactComponent };
export { SolidDesktop };
export default SolidDesktop;
