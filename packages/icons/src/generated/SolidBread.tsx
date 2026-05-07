import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBread = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.124 3.75H4.874c-.86 0-1.7.29-2.36.84a3.76 3.76 0 0 0-1.31 2.14c-.17.84-.05 1.72.34 2.49.39.76 1.04 1.37 1.83 1.71v7.82a1.5 1.5 0 0 0 1.5 1.5h14.25a1.5 1.5 0 0 0 1.5-1.5v-7.82c.79-.34 1.44-.95 1.83-1.71.4-.77.51-1.65.34-2.49a3.76 3.76 0 0 0-1.31-2.14c-.66-.55-1.5-.84-2.36-.84m-5.25 6a.75.75 0 0 0 0 1.5v7.5h-9v-7.5a.75.75 0 0 0 0-1.5c-.6 0-1.17-.24-1.59-.66s-.66-1-.66-1.59c0-.6.24-1.17.66-1.59.42-.43.99-.66 1.59-.66h9c.6 0 1.17.23 1.59.66a2.248 2.248 0 0 1-1.59 3.84" /></Svg>;
export { SolidBread as ReactComponent };
