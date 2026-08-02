import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBelt = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M6 7.5v9a.75.75 0 0 1-1.5 0H.75a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 .75-.75H4.5a.75.75 0 0 1 1.5 0m18 .75v7.5a.75.75 0 0 1-.75.75h-5.453a1.505 1.505 0 0 1-1.297.75h-6a1.5 1.5 0 0 1-1.297-.75H7.875a.376.376 0 0 1-.375-.375v-8.25a.375.375 0 0 1 .375-.375h1.328a1.494 1.494 0 0 1 1.297-.75h6a1.5 1.5 0 0 1 1.297.75h5.453a.75.75 0 0 1 .75.75m-7.5 7.481V12.75h-3a.75.75 0 0 1 0-1.5h3v-3h-6v7.5h6z" /></Svg>;
export { SolidBelt as ReactComponent };
export { SolidBelt };
export default SolidBelt;
