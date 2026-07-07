import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidUserRectangle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M16.12 11.25a4.11 4.11 0 0 1-2.54 3.81 4.117 4.117 0 0 1-4.5-.89 4.12 4.12 0 0 1-.89-4.5A4.11 4.11 0 0 1 12 7.13a4.117 4.117 0 0 1 4.12 4.12m5.63-6v13.5a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5V5.25a1.5 1.5 0 0 1 1.5-1.5h16.5a1.499 1.499 0 0 1 1.5 1.5m-1.5 13.5V5.25H3.75v13.5h1.37a7.5 7.5 0 0 1 2.76-3.26.4.4 0 0 1 .23-.07c.08.01.16.04.22.09 1.02.88 2.32 1.37 3.67 1.37 1.34 0 2.64-.49 3.66-1.37a.43.43 0 0 1 .22-.09c.08 0 .17.02.23.07a7.4 7.4 0 0 1 2.76 3.26z" /></Svg>;
export { SolidUserRectangle as ReactComponent };
