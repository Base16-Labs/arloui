import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBelt = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M23.25 15H18V9h5.25a.75.75 0 0 0 0-1.5h-5.453a1.494 1.494 0 0 0-1.297-.75h-6a1.5 1.5 0 0 0-1.297.75H6a.75.75 0 0 0-1.5 0H.75a.75.75 0 1 0 0 1.5H4.5v6H.75a.75.75 0 1 0 0 1.5H4.5a.75.75 0 0 0 1.5 0h3.203a1.505 1.505 0 0 0 1.297.75h6a1.5 1.5 0 0 0 1.297-.75h5.453a.75.75 0 0 0 0-1.5M6 9h3v6H6zm4.5 6.75v-7.5h6v3h-3a.75.75 0 1 0 0 1.5h3v3z" /></Svg>;
export { OutlineBelt as ReactComponent };
export { OutlineBelt };
export default OutlineBelt;
