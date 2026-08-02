import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidRectangleDashed = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v13.5c0 .4.158.78.439 1.06s.663.44 1.061.44h16.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M7.5 18H6c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 4.5 16.5v-3a.751.751 0 0 1 1.5 0v3h1.5a.751.751 0 0 1 0 1.5m0-10.5H6v3a.751.751 0 0 1-1.5 0v-3c0-.4.158-.78.439-1.06S5.602 6 6 6h1.5a.751.751 0 0 1 0 1.5m6 10.5h-3a.751.751 0 0 1 0-1.5h3a.751.751 0 0 1 0 1.5m0-10.5h-3a.751.751 0 0 1 0-1.5h3a.751.751 0 0 1 0 1.5m6 9c0 .4-.158.78-.439 1.06S18.398 18 18 18h-1.5a.751.751 0 0 1 0-1.5H18v-3a.751.751 0 0 1 1.5 0zm0-6a.751.751 0 0 1-1.5 0v-3h-1.5a.751.751 0 0 1 0-1.5H18c.398 0 .779.16 1.061.44s.439.66.439 1.06z" /></Svg>;
export { SolidRectangleDashed as ReactComponent };
export { SolidRectangleDashed };
export default SolidRectangleDashed;
