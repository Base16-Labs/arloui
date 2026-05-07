import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNotification = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.875 12.375v7.5c0 .39-.158.78-.439 1.06s-.663.44-1.061.44H4.125c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06V5.625c0-.4.158-.78.439-1.06.282-.29.663-.44 1.061-.44h7.5a.751.751 0 0 1 0 1.5h-7.5v14.25h14.25v-7.5a.751.751 0 0 1 1.5 0M18 2.625c-.668 0-1.32.19-1.875.57a3.37 3.37 0 0 0-1.435 3.46c.13.65.452 1.26.924 1.73a3.38 3.38 0 0 0 5.192-.51c.371-.56.569-1.21.569-1.88 0-.89-.356-1.75-.989-2.39A3.38 3.38 0 0 0 18 2.625" /></Svg>;
export { SolidNotification as ReactComponent };
