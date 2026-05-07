import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCheckSquareOffset = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3m-12 15.75a.7.7 0 0 1-.287-.06.64.64 0 0 1-.244-.16l-1.5-1.5a.75.75 0 0 1 0-1.06.755.755 0 0 1 1.062 0l.969.97 3.219-3.22a.755.755 0 0 1 1.062 0 .75.75 0 0 1 0 1.06l-3.75 3.75a.64.64 0 0 1-.244.16.7.7 0 0 1-.287.06M18.75 18a.751.751 0 0 1-.75.75h-5.25a.751.751 0 0 1 0-1.5h4.5V6.75H6.75v6a.751.751 0 0 1-1.5 0V6A.751.751 0 0 1 6 5.25h12a.75.75 0 0 1 .75.75z" /></Svg>;
export { SolidCheckSquareOffset as ReactComponent };
