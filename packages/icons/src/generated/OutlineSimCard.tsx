import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSimCard = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.031 7.72-5.25-5.25a.8.8 0 0 0-.244-.17 1 1 0 0 0-.287-.05h-9c-.398 0-.779.15-1.061.44-.281.28-.439.66-.439 1.06v16.5c0 .39.158.78.439 1.06s.663.44 1.061.44h13.5c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06v-12a.75.75 0 0 0-.219-.53M18.75 20.25H5.25V3.75h8.69l4.81 4.81zM16.5 10.5h-9a.75.75 0 0 0-.75.75V18a.751.751 0 0 0 .75.75h9a.75.75 0 0 0 .75-.75v-6.75a.751.751 0 0 0-.75-.75m-.75 6.75h-1.5v-3a.751.751 0 0 0-1.5 0v3h-1.5v-3a.751.751 0 0 0-1.5 0v3h-1.5V12h7.5z" /></Svg>;
export { OutlineSimCard as ReactComponent };
export { OutlineSimCard };
export default OutlineSimCard;
