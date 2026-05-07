import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCross = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 8.63v2.25c0 .39-.158.78-.439 1.06s-.663.44-1.061.44h-4.125V21c0 .4-.158.78-.439 1.06s-.663.44-1.061.44h-2.25c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 9.375 21v-8.62H5.25c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06V8.63c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h4.125V3c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h2.25c.398 0 .779.16 1.061.44s.439.66.439 1.06v4.13h4.125c.398 0 .779.16 1.061.44s.439.66.439 1.06" /></Svg>;
export { SolidCross as ReactComponent };
