import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFileText = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m20.031 7.72-5.25-5.25a.78.78 0 0 0-.531-.22h-9c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v16.5c0 .4.158.78.439 1.06s.663.44 1.061.44h13.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-12c0-.1-.019-.19-.057-.29a.8.8 0 0 0-.162-.24M15 16.5H9A.751.751 0 0 1 9 15h6a.751.751 0 0 1 0 1.5m0-3H9A.751.751 0 0 1 9 12h6a.751.751 0 0 1 0 1.5m-.75-5.25V4.13l4.125 4.12z" /></Svg>;
export { SolidFileText as ReactComponent };
