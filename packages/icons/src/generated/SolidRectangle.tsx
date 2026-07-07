import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidRectangle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 5.25v13.5c0 .4-.158.78-.439 1.06s-.663.44-1.061.44H3.75c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06V5.25c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h16.5c.398 0 .779.16 1.061.44s.439.66.439 1.06" /></Svg>;
export { SolidRectangle as ReactComponent };
