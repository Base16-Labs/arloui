import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineGridFour = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.75 3.75H5.25c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v13.5a1.499 1.499 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5V5.25c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44m0 7.5h-6v-6h6zm-7.5-6v6h-6v-6zm-6 7.5h6v6h-6zm13.5 6h-6v-6h6z" /></Svg>;
export { OutlineGridFour as ReactComponent };
