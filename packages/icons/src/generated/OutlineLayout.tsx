import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineLayout = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v13.5a1.499 1.499 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44m0 1.5V9H3.75V5.25zM3.75 10.5H9v8.25H3.75zm16.5 8.25H10.5V10.5h9.75z" /></Svg>;
export { OutlineLayout as ReactComponent };
export { OutlineLayout };
export default OutlineLayout;
