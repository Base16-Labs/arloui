import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMicroscope = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 21a.751.751 0 0 1-.75.75H3a.751.751 0 0 1 0-1.5h13.992a6.8 6.8 0 0 0 2.198-3.24 6.746 6.746 0 0 0-5.69-8.72v5.21c0 .39-.158.78-.439 1.06S12.398 15 12 15H7.5c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 6 13.5V3.75c0-.4.158-.78.439-1.06.282-.29.663-.44 1.061-.44H12c.398 0 .779.15 1.061.44.281.28.439.66.439 1.06v3.03a8.27 8.27 0 0 1 6.863 5.04c.578 1.39.768 2.9.549 4.39a8.3 8.3 0 0 1-1.793 4.04H21a.75.75 0 0 1 .75.75m-9-3a.751.751 0 0 0 0-1.5h-6a.751.751 0 0 0 0 1.5z" /></Svg>;
export { SolidMicroscope as ReactComponent };
export { SolidMicroscope };
export default SolidMicroscope;
