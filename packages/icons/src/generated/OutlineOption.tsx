import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineOption = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 17.25A.75.75 0 0 1 21 18h-5.91c-.28 0-.55-.08-.79-.23-.24-.14-.43-.35-.55-.6L8.91 7.5H3A.75.75 0 0 1 3 6h5.91a1.47 1.47 0 0 1 1.34.83l4.84 9.67H21a.75.75 0 0 1 .75.75m-7.5-9.75H21A.75.75 0 0 0 21 6h-6.75a.75.75 0 0 0 0 1.5" /></Svg>;
export { OutlineOption as ReactComponent };
