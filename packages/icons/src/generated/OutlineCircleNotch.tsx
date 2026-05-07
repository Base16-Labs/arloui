import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCircleNotch = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 11.625c0 2.59-1.027 5.07-2.856 6.89A9.75 9.75 0 0 1 12 21.375a9.75 9.75 0 0 1-6.894-2.86 9.72 9.72 0 0 1-2.856-6.89c0-3.84 2.232-7.35 5.687-8.93a.7.7 0 0 1 .574-.02.64.64 0 0 1 .249.15q.108.105.172.24a.744.744 0 0 1-.368.99c-2.925 1.34-4.814 4.31-4.814 7.57 0 2.19.87 4.29 2.416 5.83a8.24 8.24 0 0 0 11.668 0 8.23 8.23 0 0 0 2.416-5.83c0-3.26-1.89-6.23-4.813-7.57a.73.73 0 0 1-.39-.42.74.74 0 0 1 .021-.57.755.755 0 0 1 .995-.37c3.455 1.58 5.687 5.09 5.687 8.93" /></Svg>;
export { OutlineCircleNotch as ReactComponent };
