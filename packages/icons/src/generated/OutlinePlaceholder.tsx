import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePlaceholder = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.78.16-1.06.44C3.157 3.72 3 4.1 3 4.5v15A1.506 1.506 0 0 0 4.5 21h15c.398 0 .78-.16 1.06-.44.282-.28.44-.66.44-1.06v-15A1.506 1.506 0 0 0 19.5 3m-15 16.5V5.56L18.44 19.5zm1.06-15H19.5v13.94z" /></Svg>;
export { OutlinePlaceholder as ReactComponent };
export { OutlinePlaceholder };
export default OutlinePlaceholder;
