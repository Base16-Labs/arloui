import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCar = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 10.125h-1.013l-2.604-5.86a1.49 1.49 0 0 0-1.37-.89H6.487a1.487 1.487 0 0 0-1.37.89l-2.604 5.86H1.5a.753.753 0 0 0-.75.75.753.753 0 0 0 .75.75h.75v7.5a1.506 1.506 0 0 0 1.5 1.5H6c.398 0 .78-.16 1.06-.44.282-.28.44-.66.44-1.06v-.75h9v.75c0 .4.158.78.439 1.06s.663.44 1.061.44h2.25c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-7.5h.75a.751.751 0 0 0 0-1.5m-15 4.5H5.25a.753.753 0 0 1-.75-.75.753.753 0 0 1 .75-.75H7.5a.752.752 0 0 1 .53 1.28.75.75 0 0 1-.53.22m11.25 0H16.5a.751.751 0 0 1 0-1.5h2.25a.751.751 0 0 1 0 1.5m-14.596-4.5 2.334-5.25h11.025l2.333 5.25z" /></Svg>;
export { SolidCar as ReactComponent };
