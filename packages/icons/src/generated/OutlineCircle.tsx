import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCircle = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12 2.25c-1.93 0-3.81.57-5.42 1.64a9.8 9.8 0 0 0-3.59 4.38 9.7 9.7 0 0 0-.55 5.63c.37 1.89 1.3 3.63 2.67 4.99 1.36 1.37 3.1 2.3 4.99 2.67 1.89.38 3.85.19 5.63-.55a9.8 9.8 0 0 0 4.38-3.59 9.75 9.75 0 0 0-1.22-12.31A9.73 9.73 0 0 0 12 2.25m0 18c-1.63 0-3.23-.48-4.58-1.39a8.26 8.26 0 0 1-3.04-3.7 8.2 8.2 0 0 1-.47-4.77c.32-1.6 1.1-3.07 2.26-4.22a8.2 8.2 0 0 1 4.22-2.26c1.6-.32 3.26-.16 4.77.47 1.5.62 2.79 1.68 3.7 3.04A8.2 8.2 0 0 1 20.25 12c0 2.19-.87 4.28-2.42 5.83A8.24 8.24 0 0 1 12 20.25" /></Svg>;
export { OutlineCircle as ReactComponent };
