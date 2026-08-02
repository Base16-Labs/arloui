import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidStopCircle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.25c-1.93 0-3.81.57-5.42 1.64a9.85 9.85 0 0 0-3.59 4.38 9.7 9.7 0 0 0-.55 5.63c.37 1.89 1.3 3.63 2.67 5a9.7 9.7 0 0 0 4.99 2.66c1.89.38 3.85.19 5.63-.55a9.8 9.8 0 0 0 4.38-3.59 9.75 9.75 0 0 0-1.22-12.31A9.73 9.73 0 0 0 12 2.25m3 12.38c0 .1-.04.19-.11.26s-.17.11-.26.11H9.38c-.1 0-.2-.04-.27-.11a.36.36 0 0 1-.11-.26V9.38c0-.1.04-.2.11-.27S9.28 9 9.38 9h5.25c.09 0 .19.04.26.11s.11.17.11.27z" /></Svg>;
export { SolidStopCircle as ReactComponent };
export { SolidStopCircle };
export default SolidStopCircle;
