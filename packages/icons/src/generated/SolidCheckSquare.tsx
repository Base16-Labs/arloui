import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCheckSquare = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3m-3.219 7.28-5.25 5.25a.64.64 0 0 1-.244.16.7.7 0 0 1-.574 0 .64.64 0 0 1-.244-.16l-2.25-2.25a.75.75 0 0 1 0-1.06.755.755 0 0 1 1.062 0l1.719 1.72 4.719-4.72a.64.64 0 0 1 .244-.16.7.7 0 0 1 .574 0 .748.748 0 0 1 .244 1.22" /></Svg>;
export { SolidCheckSquare as ReactComponent };
