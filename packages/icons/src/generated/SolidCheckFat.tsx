import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCheckFat = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.434 7.96 10.396 20c-.28.28-.663.44-1.06.44-.398 0-.779-.16-1.06-.44L1.56 13.25c-.28-.28-.438-.66-.438-1.06s.157-.78.438-1.06l1.875-1.87c.281-.28.662-.44 1.059-.44s.777.16 1.058.44l3.82 3.7L18.444 4c.282-.28.662-.44 1.06-.44.396 0 .777.16 1.058.44l1.871 1.83a1.501 1.501 0 0 1 .001 2.13" /></Svg>;
export { SolidCheckFat as ReactComponent };
