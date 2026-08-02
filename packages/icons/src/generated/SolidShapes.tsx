import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidShapes = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M10.837 17.76c.037.12.047.24.03.35a.8.8 0 0 1-.133.33.8.8 0 0 1-.267.23.8.8 0 0 1-.342.08h-7.5a.8.8 0 0 1-.342-.08.8.8 0 0 1-.266-.23.77.77 0 0 1-.104-.68l3.75-11.25A.74.74 0 0 1 6.375 6a.74.74 0 0 1 .712.51zm9.038-9.88c0-.97-.286-1.91-.822-2.71a4.9 4.9 0 0 0-2.187-1.8 4.94 4.94 0 0 0-2.817-.28 4.9 4.9 0 0 0-2.496 1.34 4.87 4.87 0 0 0-1.057 5.31c.369.89.994 1.65 1.796 2.19.8.54 1.744.82 2.708.82a4.85 4.85 0 0 0 3.446-1.43 4.87 4.87 0 0 0 1.429-3.44m1.5 6.37h-8.25a.75.75 0 0 0-.75.75v5.25a.751.751 0 0 0 .75.75h8.25a.75.75 0 0 0 .75-.75V15a.751.751 0 0 0-.75-.75" /></Svg>;
export { SolidShapes as ReactComponent };
export { SolidShapes };
export default SolidShapes;
