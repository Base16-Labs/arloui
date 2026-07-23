import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPlusCircle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.25c-1.93 0-3.81.57-5.42 1.64a9.8 9.8 0 0 0-3.59 4.38 9.7 9.7 0 0 0-.55 5.63c.37 1.89 1.3 3.63 2.67 4.99a9.7 9.7 0 0 0 4.99 2.67c1.89.38 3.85.18 5.63-.55a9.75 9.75 0 0 0 4.38-3.6 9.733 9.733 0 0 0-1.22-12.3A9.75 9.75 0 0 0 12 2.25m3.75 10.5h-3v3a.75.75 0 0 1-1.5 0v-3h-3a.75.75 0 0 1 0-1.5h3v-3a.75.75 0 0 1 1.5 0v3h3a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidPlusCircle as ReactComponent };
