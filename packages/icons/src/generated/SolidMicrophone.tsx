import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMicrophone = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M7.5 11.625v-6c0-1.2.47-2.34 1.32-3.19.84-.84 1.99-1.31 3.18-1.31s2.34.47 3.18 1.31c.85.85 1.32 1.99 1.32 3.19v6c0 1.19-.47 2.33-1.32 3.18-.84.84-1.99 1.32-3.18 1.32s-2.34-.48-3.18-1.32a4.5 4.5 0 0 1-1.32-3.18m12 0a.75.75 0 0 0-1.5 0 6.012 6.012 0 0 1-6 6 6.01 6.01 0 0 1-6-6 .75.75 0 0 0-1.5 0c0 1.85.69 3.65 1.94 5.03a7.56 7.56 0 0 0 4.81 2.43v3.04a.75.75 0 0 0 1.5 0v-3.04a7.56 7.56 0 0 0 4.81-2.43 7.5 7.5 0 0 0 1.94-5.03" /></Svg>;
export { SolidMicrophone as ReactComponent };
export { SolidMicrophone };
export default SolidMicrophone;
