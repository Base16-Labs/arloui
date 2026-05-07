import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePause = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.75 3H15c-.398 0-.779.15-1.061.44-.281.28-.439.66-.439 1.06v15c0 .39.158.78.439 1.06S14.602 21 15 21h3.75c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06v-15c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 18.75 3m0 16.5H15v-15h3.75zM9 3H5.25c-.398 0-.779.15-1.061.44-.281.28-.439.66-.439 1.06v15c0 .39.158.78.439 1.06s.663.44 1.061.44H9c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06v-15c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 9 3m0 16.5H5.25v-15H9z" /></Svg>;
export { OutlinePause as ReactComponent };
