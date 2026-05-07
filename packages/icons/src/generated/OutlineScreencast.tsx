import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineScreencast = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 5.25v13.5c0 .4-.158.78-.439 1.06s-.663.44-1.061.44H13.5a.751.751 0 0 1 0-1.5h6.75V5.25H3.75V9a.751.751 0 0 1-1.5 0V5.25c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h16.5c.398 0 .779.16 1.061.44s.439.66.439 1.06M3 17.25a.751.751 0 0 0 0 1.5.75.75 0 0 1 .75.75.751.751 0 0 0 1.5 0c0-.6-.237-1.17-.659-1.59A2.26 2.26 0 0 0 3 17.25m0-3a.751.751 0 0 0 0 1.5 3.75 3.75 0 0 1 3.75 3.75.751.751 0 0 0 1.5 0 5.25 5.25 0 0 0-1.539-3.71A5.27 5.27 0 0 0 3 14.25m0-3a.751.751 0 0 0 0 1.5c1.79 0 3.505.71 4.771 1.98A6.77 6.77 0 0 1 9.75 19.5a.751.751 0 0 0 1.5 0 8.26 8.26 0 0 0-2.419-5.83A8.24 8.24 0 0 0 3 11.25" /></Svg>;
export { OutlineScreencast as ReactComponent };
