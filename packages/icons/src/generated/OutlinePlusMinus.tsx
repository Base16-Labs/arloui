import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePlusMinus = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m19.28 6.905-13.5 13.5a.75.75 0 1 1-1.06-1.06l13.5-13.5a.75.75 0 1 1 1.06 1.06M6 11.625a.75.75 0 0 0 1.5 0v-3h3a.75.75 0 0 0 0-1.5h-3v-3a.75.75 0 0 0-1.5 0v3H3a.75.75 0 0 0 0 1.5h3zm15 6h-7.5a.75.75 0 0 0 0 1.5H21a.75.75 0 0 0 0-1.5" /></Svg>;
export { OutlinePlusMinus as ReactComponent };
export { OutlinePlusMinus };
export default OutlinePlusMinus;
