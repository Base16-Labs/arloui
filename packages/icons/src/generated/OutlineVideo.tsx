import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineVideo = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m15.416 9.87-4.5-3a.84.84 0 0 0-.38-.12.67.67 0 0 0-.39.09c-.12.06-.22.16-.29.27a.77.77 0 0 0-.106.39v6c0 .13.037.27.106.38a.76.76 0 0 0 .68.37.74.74 0 0 0 .38-.13l4.5-3a.76.76 0 0 0 .335-.62c0-.12-.031-.25-.089-.36a.85.85 0 0 0-.246-.27M11.25 12.1V8.91l2.398 1.59zm9-8.35H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v10.5c0 .4.158.78.439 1.06s.663.44 1.061.44h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m0 12H3.75V5.25h16.5zm1.5 3.75a.75.75 0 0 1-.75.75H3a.751.751 0 0 1 0-1.5h18a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineVideo as ReactComponent };
