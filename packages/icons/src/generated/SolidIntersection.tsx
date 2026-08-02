import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidIntersection = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.4 0-.78.15-1.06.44C3.16 3.72 3 4.1 3 4.5v15A1.499 1.499 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44m-2.25 13.5a.75.75 0 1 1-1.5 0v-5.25A3.737 3.737 0 0 0 12 7.5c-.99 0-1.95.39-2.65 1.09-.7.71-1.1 1.66-1.1 2.66v5.25a.75.75 0 1 1-1.5 0v-5.25c0-1.4.56-2.73 1.54-3.72a5.276 5.276 0 0 1 7.43 0c.98.99 1.53 2.32 1.53 3.72z" /></Svg>;
export { SolidIntersection as ReactComponent };
export { SolidIntersection };
export default SolidIntersection;
