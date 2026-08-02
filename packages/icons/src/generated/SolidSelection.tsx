import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSelection = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.499 1.499 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3M9.75 18.75h-3a1.499 1.499 0 0 1-1.5-1.5v-3a.75.75 0 0 1 1.5 0v3h3a.75.75 0 0 1 0 1.5m0-12h-3v3a.75.75 0 0 1-1.5 0v-3a1.5 1.5 0 0 1 1.5-1.5h3a.75.75 0 0 1 0 1.5m9 10.5a1.5 1.5 0 0 1-1.5 1.5h-3a.75.75 0 0 1 0-1.5h3v-3a.75.75 0 0 1 1.5 0zm0-7.5a.75.75 0 0 1-1.5 0v-3h-3a.75.75 0 0 1 0-1.5h3a1.5 1.5 0 0 1 1.5 1.5z" /></Svg>;
export { SolidSelection as ReactComponent };
export { SolidSelection };
export default SolidSelection;
