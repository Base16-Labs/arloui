import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidParallelogram = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m23.117 5.86-6.08 13.5c-.12.27-.31.49-.55.65-.24.15-.53.24-.82.24H2.247a1.522 1.522 0 0 1-1.26-.69c-.13-.21-.22-.45-.23-.7-.02-.25.02-.5.12-.73l6.08-13.5a1.49 1.49 0 0 1 1.37-.88h13.42c.25 0 .5.06.72.18s.4.29.54.5.22.45.24.7c.01.25-.03.5-.13.73" /></Svg>;
export { SolidParallelogram as ReactComponent };
export { SolidParallelogram };
export default SolidParallelogram;
