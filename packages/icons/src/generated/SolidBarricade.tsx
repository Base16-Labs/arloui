import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBarricade = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 5.25H3a1.506 1.506 0 0 0-1.5 1.5v6.75c0 .398.16.78.44 1.061S2.6 15 3 15h2.25v3a.748.748 0 0 0 1.28.531.76.76 0 0 0 .22-.531v-3h10.5v3a.748.748 0 0 0 1.28.531.76.76 0 0 0 .22-.531v-3H21c.4 0 .78-.158 1.06-.439s.44-.663.44-1.061V6.75a1.506 1.506 0 0 0-1.5-1.5M3 13.5V7.875L8.63 13.5zm18 0h-5.31L8.94 6.75h6.44L21 12.375z" /></Svg>;
export { SolidBarricade as ReactComponent };
export { SolidBarricade };
export default SolidBarricade;
