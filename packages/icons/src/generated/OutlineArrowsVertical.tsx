import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineArrowsVertical = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M15.53 18.22a.754.754 0 0 1 0 1.06l-3 3a.74.74 0 0 1-.53.22.74.74 0 0 1-.531-.22l-3-3a.75.75 0 0 1 1.062-1.06l1.718 1.72V4.06L9.53 5.78A.75.75 0 0 1 8.47 4.72l3-3a.761.761 0 0 1 .818-.163.8.8 0 0 1 .244.163l3 3a.754.754 0 0 1 0 1.06.75.75 0 0 1-1.062 0l-1.72-1.72v15.88l1.72-1.72a.761.761 0 0 1 .818-.163.8.8 0 0 1 .244.163" /></Svg>;
export { OutlineArrowsVertical as ReactComponent };
