import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCards = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.75 8.25v10.5c0 .4-.158.78-.439 1.06s-.663.44-1.061.44H3.75c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06V8.25c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h13.5c.398 0 .779.16 1.061.44s.439.66.439 1.06m1.5-4.5H6a.751.751 0 0 0 0 1.5h14.25V16.5a.751.751 0 0 0 1.5 0V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44" /></Svg>;
export { SolidCards as ReactComponent };
