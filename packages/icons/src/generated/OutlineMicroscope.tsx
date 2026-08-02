import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineMicroscope = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 20.25h-1.881a8.3 8.3 0 0 0 1.793-4.04c.219-1.49.029-3-.549-4.39A8.268 8.268 0 0 0 13.5 6.78V3.75c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 12 2.25H7.5c-.398 0-.779.15-1.061.44C6.158 2.97 6 3.35 6 3.75v9.75c0 .39.158.78.439 1.06S7.102 15 7.5 15H12c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06V8.29c1.323.15 2.573.68 3.592 1.54s1.762 2 2.135 3.27a6.75 6.75 0 0 1-.037 3.91 6.8 6.8 0 0 1-2.198 3.24H3a.751.751 0 0 0 0 1.5h18a.751.751 0 0 0 0-1.5m-9-6.75H7.5V3.75H12zM6.75 18a.751.751 0 0 1 0-1.5h6a.751.751 0 0 1 0 1.5z" /></Svg>;
export { OutlineMicroscope as ReactComponent };
export { OutlineMicroscope };
export default OutlineMicroscope;
