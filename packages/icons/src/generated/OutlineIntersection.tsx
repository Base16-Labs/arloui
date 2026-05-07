import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineIntersection = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 11.625v7.5a.75.75 0 1 1-1.5 0v-7.5c0-1.6-.63-3.12-1.75-4.25a6.02 6.02 0 0 0-8.49 0A6 6 0 0 0 6 11.625v7.5a.75.75 0 1 1-1.5 0v-7.5c0-1.99.79-3.9 2.2-5.31a7.52 7.52 0 0 1 10.61 0 7.54 7.54 0 0 1 2.19 5.31" /></Svg>;
export { OutlineIntersection as ReactComponent };
