import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCarSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.5 10.125h-1.013l-2.604-5.86a1.49 1.49 0 0 0-1.37-.89H6.487a1.49 1.49 0 0 0-1.37.89l-2.605 5.86H1.5a.751.751 0 0 0 0 1.5h.75v7.5c0 .4.158.78.439 1.06s.663.44 1.061.44H6c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-1.5h9v1.5c0 .4.158.78.439 1.06s.663.44 1.061.44h2.25c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-7.5h.75a.751.751 0 0 0 0-1.5M6.487 4.875h11.026l2.333 5.25H4.154zm13.763 14.25H18v-2.25a.751.751 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v2.25H3.75v-7.5h16.5z" /></Svg>;
export { OutlineCarSimple as ReactComponent };
