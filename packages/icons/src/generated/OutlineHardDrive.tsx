import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineHardDrive = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 6H3c-.398 0-.779.15-1.061.44-.281.28-.439.66-.439 1.06v9c0 .39.158.78.439 1.06S2.602 18 3 18h18c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06v-9c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 21 6m0 10.5H3v-9h18zM18.75 12c0 .22-.066.44-.19.62-.123.19-.299.33-.504.42a1.2 1.2 0 0 1-.65.06 1.1 1.1 0 0 1-.576-.31 1.107 1.107 0 0 1-.244-1.22c.085-.21.229-.39.414-.51s.403-.19.625-.19c.298 0 .585.12.796.33.21.21.329.5.329.8" /></Svg>;
export { OutlineHardDrive as ReactComponent };
