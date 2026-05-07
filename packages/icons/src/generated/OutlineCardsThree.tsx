import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCardsThree = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 9h-15c-.398 0-.779.16-1.061.44S3 10.1 3 10.5v9c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-9c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 9m0 10.5h-15v-9h15zM4.5 6.75A.751.751 0 0 1 5.25 6h13.5a.751.751 0 0 1 0 1.5H5.25a.75.75 0 0 1-.75-.75m1.5-3A.751.751 0 0 1 6.75 3h10.5a.751.751 0 0 1 0 1.5H6.75A.75.75 0 0 1 6 3.75" /></Svg>;
export { OutlineCardsThree as ReactComponent };
