import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWall = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 5.25v3a.376.376 0 0 1-.375.38H12.75V4.88a.376.376 0 0 1 .375-.38H21a.75.75 0 0 1 .75.75m-.375 4.88H17.25v4.12h4.125a.376.376 0 0 0 .375-.37V10.5a.376.376 0 0 0-.375-.37M8.25 14.25h7.5v-4.12h-7.5zm-5.625 0H6.75v-4.12H2.625a.376.376 0 0 0-.375.37v3.38a.376.376 0 0 0 .375.37m18.75 1.5H12.75v3.38a.376.376 0 0 0 .375.37H21a.75.75 0 0 0 .75-.75v-2.62a.376.376 0 0 0-.375-.38M2.625 8.63h8.625V4.88a.376.376 0 0 0-.375-.38H3a.75.75 0 0 0-.75.75v3a.376.376 0 0 0 .375.38m-.375 7.5v2.62a.751.751 0 0 0 .75.75h7.875a.376.376 0 0 0 .375-.37v-3.38H2.625a.376.376 0 0 0-.375.38" /></Svg>;
export { SolidWall as ReactComponent };
