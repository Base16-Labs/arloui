import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineControl = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.28 15.905a.8.8 0 0 1-.244.17 1 1 0 0 1-.287.05 1 1 0 0 1-.287-.05.8.8 0 0 1-.244-.17L12 9.685l-6.219 6.22a.755.755 0 0 1-1.062 0 .75.75 0 0 1 0-1.06l6.75-6.75a.78.78 0 0 1 .531-.22q.149 0 .287.06c.091.04.175.09.245.16l6.75 6.75a.75.75 0 0 1 0 1.06" /></Svg>;
export { OutlineControl as ReactComponent };
export { OutlineControl };
export default OutlineControl;
