import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineGridNine = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 4.5H3.75c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v12a1.499 1.499 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V6c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44m-10.5 9v-3h4.5v3zm4.5 1.5v3h-4.5v-3zm-10.5-4.5h4.5v3h-4.5zm6-1.5V6h4.5v3zm6 1.5h4.5v3h-4.5zm4.5-1.5h-4.5V6h4.5zm-12-3v3h-4.5V6zm-4.5 9h4.5v3h-4.5zm16.5 3h-4.5v-3h4.5z" /></Svg>;
export { OutlineGridNine as ReactComponent };
export { OutlineGridNine };
export default OutlineGridNine;
