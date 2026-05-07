import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSquareSplitVertical = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 5.25v5.63a.376.376 0 0 1-.375.37H4.125a.376.376 0 0 1-.375-.37V5.25c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h13.5c.398 0 .779.16 1.061.44s.439.66.439 1.06m-.375 7.5H4.125a.376.376 0 0 0-.375.38v5.62c0 .4.158.78.439 1.06s.663.44 1.061.44h13.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-5.62a.376.376 0 0 0-.375-.38" /></Svg>;
export { SolidSquareSplitVertical as ReactComponent };
