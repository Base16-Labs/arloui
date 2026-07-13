import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidAngle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.4 0-.78.158-1.06.439s-.44.663-.44 1.061v13.5c0 .398.16.779.44 1.061s.66.439 1.06.439h16.5c.4 0 .78-.158 1.06-.439s.44-.663.44-1.061V5.25c0-.398-.16-.779-.44-1.061a1.5 1.5 0 0 0-1.06-.439m-9.75 4.5c1.59.002 3.12.634 4.24 1.759a5.98 5.98 0 0 1 1.76 4.241.751.751 0 0 1-1.5 0c0-1.193-.47-2.337-1.32-3.181A4.5 4.5 0 0 0 10.5 9.75a.751.751 0 0 1 0-1.5M18.75 18H7.5a.751.751 0 0 1-.75-.75v-7.5h-1.5a.751.751 0 0 1 0-1.5h1.5v-1.5a.751.751 0 0 1 1.5 0v9.75h10.5a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidAngle as ReactComponent };
