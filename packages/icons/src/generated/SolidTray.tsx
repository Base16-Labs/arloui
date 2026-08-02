import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTray = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3m0 16.5h-15v-3.75h2.69L9 17.56c.139.14.304.25.486.33.182.07.377.11.574.11h3.88c.197 0 .392-.04.574-.11.182-.08.347-.19.486-.33l1.81-1.81h2.69z" /></Svg>;
export { SolidTray as ReactComponent };
export { SolidTray };
export default SolidTray;
