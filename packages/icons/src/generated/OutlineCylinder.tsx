import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCylinder = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 1.5c-3.785 0-6.75 1.81-6.75 4.13v12.75c0 2.31 2.965 4.12 6.75 4.12s6.75-1.81 6.75-4.12V5.63c0-2.32-2.965-4.13-6.75-4.13M12 3c2.483 0 5.25 1.08 5.25 2.63 0 1.54-2.767 2.62-5.25 2.62S6.75 7.17 6.75 5.63C6.75 4.08 9.517 3 12 3m0 18c-2.797 0-5.25-1.22-5.25-2.62V8.25c1.228.93 3.107 1.5 5.25 1.5s4.022-.58 5.25-1.5v10.13c0 1.4-2.453 2.62-5.25 2.62" /></Svg>;
export { OutlineCylinder as ReactComponent };
