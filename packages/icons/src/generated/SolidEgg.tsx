import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidEgg = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 14.25c0 2.19-.87 4.29-2.41 5.83A8.26 8.26 0 0 1 12 22.5c-2.18 0-4.28-.87-5.83-2.42a8.22 8.22 0 0 1-2.42-5.83c0-2.89 1.01-6.04 2.75-8.67C8.21 3.03 10.27 1.5 12 1.5c1.74 0 3.8 1.53 5.5 4.08 1.75 2.63 2.75 5.78 2.75 8.67" /></Svg>;
export { SolidEgg as ReactComponent };
