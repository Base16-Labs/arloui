import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidChartLineUp = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v13.5c0 .4.158.78.439 1.06s.663.44 1.061.44h16.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M18.75 18H5.25a.75.75 0 0 1-.75-.75V6.75a.751.751 0 0 1 1.5 0v7.19l3.219-3.22c.07-.07.153-.13.244-.17a1 1 0 0 1 .287-.05 1 1 0 0 1 .287.05c.091.04.174.1.244.17L12 12.44l4.19-4.19H13.5a.751.751 0 0 1 0-1.5H18a.75.75 0 0 1 .75.75V12a.751.751 0 0 1-1.5 0V9.31l-4.719 4.72a.78.78 0 0 1-.531.22.782.782 0 0 1-.531-.22L9.75 12.31 6 16.06v.44h12.75a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidChartLineUp as ReactComponent };
