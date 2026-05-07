import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidRowsPlusBottom = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 10.5v2.25c0 .4-.158.78-.439 1.06s-.663.44-1.061.44h-15c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 3 12.75V10.5c0-.4.158-.78.439-1.06S4.102 9 4.5 9h15c.398 0 .779.16 1.061.44S21 10.1 21 10.5m-1.5-8.25h-15c-.398 0-.779.16-1.061.44S3 3.35 3 3.75V6c0 .4.158.78.439 1.06s.663.44 1.061.44h15c.398 0 .779-.16 1.061-.44S21 6.4 21 6V3.75c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M14.25 18h-1.5v-1.5a.751.751 0 0 0-1.5 0V18h-1.5a.751.751 0 0 0 0 1.5h1.5V21a.751.751 0 0 0 1.5 0v-1.5h1.5a.751.751 0 0 0 0-1.5" /></Svg>;
export { SolidRowsPlusBottom as ReactComponent };
