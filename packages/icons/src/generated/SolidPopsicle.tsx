import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPopsicle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 .375c-1.79 0-3.505.71-4.771 1.98a6.75 6.75 0 0 0-1.979 4.77v9c0 .4.158.78.439 1.06s.663.44 1.061.44h3v3.75a2.256 2.256 0 0 0 2.25 2.25 2.256 2.256 0 0 0 2.25-2.25v-3.75h3c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-9a6.75 6.75 0 0 0-1.979-4.77A6.73 6.73 0 0 0 12 .375m-1.5 13.5a.751.751 0 0 1-1.5 0v-7.5a.751.751 0 0 1 1.5 0zm2.25 7.5a.751.751 0 0 1-1.5 0v-3.75h1.5zm2.25-7.5a.751.751 0 0 1-1.5 0v-7.5a.751.751 0 0 1 1.5 0z" /></Svg>;
export { SolidPopsicle as ReactComponent };
export { SolidPopsicle };
export default SolidPopsicle;
