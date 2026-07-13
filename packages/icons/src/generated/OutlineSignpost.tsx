import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSignpost = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m22.31 10-3.156-3.51a1.5 1.5 0 0 0-.506-.36 1.4 1.4 0 0 0-.61-.13h-6.04V3a.751.751 0 0 0-1.5 0v3h-7.5c-.399 0-.78.16-1.061.44-.282.28-.44.66-.44 1.06v6c0 .4.158.78.44 1.06s.662.44 1.06.44h7.5v6a.751.751 0 0 0 1.5 0v-6h6.041c.212 0 .418-.05.61-.13.192-.09.364-.21.506-.37L22.31 11a.76.76 0 0 0 .192-.5c0-.19-.07-.37-.192-.5m-4.271 3.5H2.996v-6H18.04l2.7 3z" /></Svg>;
export { OutlineSignpost as ReactComponent };
