import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidChartLine = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v13.5c0 .4.158.78.439 1.06s.663.44 1.061.44h16.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-1.5 12.75a.751.751 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75V6.75a.751.751 0 0 1 1.5 0v5.9l3.27-2.73a.8.8 0 0 1 .44-.17c.162-.01.322.03.456.12l4.032 2.69 4.069-3.39a.73.73 0 0 1 .548-.17c.199.02.381.11.509.27a.75.75 0 0 1 .17.55.73.73 0 0 1-.267.5l-4.5 3.75a.724.724 0 0 1-.896.05L9.8 11.43 6 14.6v1.9z" /></Svg>;
export { SolidChartLine as ReactComponent };
