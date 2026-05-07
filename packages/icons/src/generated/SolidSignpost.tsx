import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSignpost = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m22.31 11-3.156 3.5c-.142.16-.314.28-.506.37-.192.08-.398.13-.61.13h-6.04v6a.751.751 0 0 1-1.5 0v-6h-7.5c-.399 0-.78-.16-1.061-.44a1.5 1.5 0 0 1-.44-1.06v-6c0-.4.158-.78.44-1.06.282-.29.662-.44 1.06-.44h7.5V3a.751.751 0 0 1 1.5 0v3h6.041c.212 0 .418.04.61.13.192.08.364.21.506.36l3.157 3.5a.764.764 0 0 1 0 1.01" /></Svg>;
export { SolidSignpost as ReactComponent };
