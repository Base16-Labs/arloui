import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBarricade = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 5.25H3a1.506 1.506 0 0 0-1.5 1.5v6.75c0 .398.16.78.44 1.061S2.6 15 3 15h2.25v3a.748.748 0 0 0 1.28.531.76.76 0 0 0 .22-.531v-3h10.5v3a.748.748 0 0 0 1.28.531.76.76 0 0 0 .22-.531v-3H21c.4 0 .78-.158 1.06-.439s.44-.663.44-1.061V6.75a1.506 1.506 0 0 0-1.5-1.5m0 6.065L16.44 6.75H21zM7.57 6.75l6.75 6.75H9.69L3 6.815V6.75zM3 8.936 7.57 13.5H3zM21 13.5h-4.56L9.69 6.75h4.63L21 13.437z" /></Svg>;
export { OutlineBarricade as ReactComponent };
