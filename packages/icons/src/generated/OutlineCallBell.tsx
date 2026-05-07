import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCallBell = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M2.25 18h19.5a.75.75 0 0 0 0-1.5H21V15c0-2.26-.85-4.43-2.38-6.09a9 9 0 0 0-5.87-2.88V4.5h1.5a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0 0 1.5h1.5v1.53a9 9 0 0 0-5.87 2.88A8.98 8.98 0 0 0 3 15v1.5h-.75a.75.75 0 0 0 0 1.5m2.25-3c0-1.99.79-3.9 2.2-5.31A7.5 7.5 0 0 1 12 7.5c1.99 0 3.9.79 5.3 2.19A7.5 7.5 0 0 1 19.5 15v1.5h-15zm18 5.25a.75.75 0 0 1-.75.75H2.25a.75.75 0 0 1 0-1.5h19.5a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineCallBell as ReactComponent };
