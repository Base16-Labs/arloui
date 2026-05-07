import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTable = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 4.5H3a.75.75 0 0 0-.75.75V18c0 .4.158.78.439 1.06s.663.44 1.061.44h16.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V5.25A.751.751 0 0 0 21 4.5m-17.25 6H7.5v3H3.75zm5.25 0h11.25v3H9zM20.25 6v3H3.75V6zm-16.5 9H7.5v3H3.75zm16.5 3H9v-3h11.25z" /></Svg>;
export { OutlineTable as ReactComponent };
