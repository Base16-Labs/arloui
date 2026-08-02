import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidEraser = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m21.095 7.539-3.883-3.88a2.26 2.26 0 0 0-1.59-.66 2.26 2.26 0 0 0-1.591.66L2.906 14.789c-.421.42-.659.99-.659 1.59 0 .59.238 1.17.66 1.59l2.818 2.82c.07.07.153.12.245.16.09.04.189.06.288.05H20.25c.198 0 .389-.07.53-.21.14-.15.22-.34.22-.54 0-.19-.08-.38-.22-.53a.75.75 0 0 0-.53-.22h-7.942l8.786-8.78c.42-.42.658-.99.658-1.59 0-.59-.238-1.17-.659-1.59m-1.063 2.12L15 14.689l-4.94-4.94 5.034-5.03a.77.77 0 0 1 .53-.22.782.782 0 0 1 .531.22l3.878 3.88a.745.745 0 0 1 0 1.06z" /></Svg>;
export { SolidEraser as ReactComponent };
export { SolidEraser };
export default SolidEraser;
