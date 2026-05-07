import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidClock = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12 2.25c-1.93 0-3.81.57-5.42 1.64a9.8 9.8 0 0 0-3.59 4.38 9.7 9.7 0 0 0-.55 5.63c.37 1.89 1.3 3.63 2.67 4.99 1.36 1.37 3.1 2.3 4.99 2.67 1.89.38 3.85.19 5.63-.55a9.8 9.8 0 0 0 4.38-3.59 9.75 9.75 0 0 0-1.22-12.31A9.73 9.73 0 0 0 12 2.25m5.25 10.5H12a.75.75 0 0 1-.75-.75V6.75a.75.75 0 0 1 1.5 0v4.5h4.5a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidClock as ReactComponent };
