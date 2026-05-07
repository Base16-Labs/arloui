import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCircleHalf = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12 2.25c-1.93 0-3.81.57-5.42 1.64a9.8 9.8 0 0 0-3.59 4.38 9.7 9.7 0 0 0-.55 5.63c.37 1.89 1.3 3.63 2.67 4.99 1.36 1.37 3.1 2.3 4.99 2.67 1.89.38 3.85.19 5.63-.55a9.8 9.8 0 0 0 4.38-3.59 9.75 9.75 0 0 0-1.22-12.31A9.73 9.73 0 0 0 12 2.25M3.75 12c0-2.19.87-4.28 2.42-5.83A8.24 8.24 0 0 1 12 3.75v16.5c-2.19 0-4.28-.87-5.83-2.42A8.24 8.24 0 0 1 3.75 12" /></Svg>;
export { SolidCircleHalf as ReactComponent };
