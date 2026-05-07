import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePopsicle = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12 .375c-1.79 0-3.505.71-4.771 1.98a6.75 6.75 0 0 0-1.979 4.77v9c0 .4.158.78.439 1.06s.663.44 1.061.44h3v3.75a2.256 2.256 0 0 0 2.25 2.25 2.256 2.256 0 0 0 2.25-2.25v-3.75h3c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-9a6.75 6.75 0 0 0-1.979-4.77A6.73 6.73 0 0 0 12 .375m.75 21a.751.751 0 0 1-1.5 0v-3.75h1.5zm4.5-5.25H6.75v-9c0-1.39.553-2.73 1.538-3.71A5.23 5.23 0 0 1 12 1.875c1.392 0 2.728.55 3.712 1.54a5.24 5.24 0 0 1 1.538 3.71zm-6-9.75v7.5a.751.751 0 0 1-1.5 0v-7.5a.751.751 0 0 1 1.5 0m3 0v7.5a.751.751 0 0 1-1.5 0v-7.5a.751.751 0 0 1 1.5 0" /></Svg>;
export { OutlinePopsicle as ReactComponent };
