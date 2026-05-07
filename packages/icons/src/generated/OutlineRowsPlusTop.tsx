import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineRowsPlusTop = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 16.5h-15c-.398 0-.779.16-1.061.44S3 17.6 3 18v2.25c0 .4.158.78.439 1.06s.663.44 1.061.44h15c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V18c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m0 3.75h-15V18h15zm0-10.5h-15c-.398 0-.779.16-1.061.44S3 10.85 3 11.25v2.25c0 .4.158.78.439 1.06S4.102 15 4.5 15h15c.398 0 .779-.16 1.061-.44S21 13.9 21 13.5v-2.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m0 3.75h-15v-2.25h15zM9 5.25a.751.751 0 0 1 .75-.75h1.5V3a.751.751 0 0 1 1.5 0v1.5h1.5a.751.751 0 0 1 0 1.5h-1.5v1.5a.751.751 0 0 1-1.5 0V6h-1.5A.75.75 0 0 1 9 5.25" /></Svg>;
export { OutlineRowsPlusTop as ReactComponent };
