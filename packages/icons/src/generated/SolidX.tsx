import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidX = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3m-2.469 12.97a.75.75 0 0 1 0 1.06.64.64 0 0 1-.244.16.7.7 0 0 1-.574 0 .64.64 0 0 1-.244-.16L12 13.06l-3.969 3.97a.755.755 0 0 1-1.062 0 .75.75 0 0 1 0-1.06L10.94 12 6.969 8.03a.75.75 0 0 1 0-1.06.755.755 0 0 1 1.062 0L12 10.94l3.969-3.97a.755.755 0 0 1 1.062 0 .75.75 0 0 1 0 1.06L13.06 12z" /></Svg>;
export { SolidX as ReactComponent };
