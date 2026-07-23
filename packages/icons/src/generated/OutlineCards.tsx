import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCards = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M17.25 6.75H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v10.5c0 .4.158.78.439 1.06s.663.44 1.061.44h13.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V8.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m0 12H3.75V8.25h13.5zm4.5-13.5V16.5a.751.751 0 0 1-1.5 0V5.25H6a.751.751 0 0 1 0-1.5h14.25c.398 0 .779.16 1.061.44s.439.66.439 1.06" /></Svg>;
export { OutlineCards as ReactComponent };
