import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidChair = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 12.75h-3v-3H18a1.5 1.5 0 0 0 1.5-1.5v-4.5a1.5 1.5 0 0 0-1.5-1.5H6a1.5 1.5 0 0 0-1.5 1.5v4.5A1.5 1.5 0 0 0 6 9.75h1.5v3h-3a1.5 1.5 0 0 0-1.5 1.5v1.5a1.5 1.5 0 0 0 1.5 1.5h.75V21a.75.75 0 0 0 1.5 0v-3.75h10.5V21a.75.75 0 0 0 1.5 0v-3.75h.75a1.5 1.5 0 0 0 1.5-1.5v-1.5a1.5 1.5 0 0 0-1.5-1.5m-4.5 0H9v-3h6z" /></Svg>;
export { SolidChair as ReactComponent };
export { SolidChair };
export default SolidChair;
