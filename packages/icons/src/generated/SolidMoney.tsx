import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMoney = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M15.75 12c0 .74-.22 1.46-.63 2.08s-1 1.1-1.68 1.38c-.69.28-1.44.36-2.17.21-.73-.14-1.4-.5-1.92-1.02-.53-.53-.88-1.19-1.03-1.92-.14-.73-.07-1.48.22-2.17A3.741 3.741 0 0 1 12 8.25c.99 0 1.95.39 2.65 1.09.7.71 1.1 1.66 1.1 2.66m7.5-6v12a.75.75 0 0 1-.75.75h-21A.75.75 0 0 1 .75 18V6a.75.75 0 0 1 .75-.75h21a.75.75 0 0 1 .75.75m-1.5 4.34A5.2 5.2 0 0 1 19.5 9c-.63-.63-1.09-1.4-1.35-2.25H5.85C5.59 7.6 5.13 8.37 4.5 9a5.2 5.2 0 0 1-2.25 1.34v3.31c.85.25 1.63.71 2.25 1.34.63.63 1.09 1.4 1.35 2.26h12.3c.26-.86.72-1.63 1.35-2.26a5.2 5.2 0 0 1 2.25-1.34z" /></Svg>;
export { SolidMoney as ReactComponent };
