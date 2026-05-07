import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPause = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 4.5v15c0 .39-.158.78-.439 1.06s-.663.44-1.061.44H15c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06v-15c0-.4.158-.78.439-1.06.282-.29.663-.44 1.061-.44h3.75c.398 0 .779.15 1.061.44.281.28.439.66.439 1.06M9 3H5.25c-.398 0-.779.15-1.061.44-.281.28-.439.66-.439 1.06v15c0 .39.158.78.439 1.06s.663.44 1.061.44H9c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06v-15c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 9 3" /></Svg>;
export { SolidPause as ReactComponent };
