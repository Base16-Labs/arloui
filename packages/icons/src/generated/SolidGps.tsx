import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidGps = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M23.25 12a.75.75 0 0 1-.75.75h-2.28a8.26 8.26 0 0 1-7.47 7.46v2.29a.75.75 0 1 1-1.5 0v-2.29a8.3 8.3 0 0 1-5.08-2.38 8.3 8.3 0 0 1-2.38-5.08H1.5a.75.75 0 0 1-.53-1.28.7.7 0 0 1 .53-.22h2.29a8.26 8.26 0 0 1 7.46-7.47V1.5c0-.2.08-.39.22-.53A.7.7 0 0 1 12 .75c.2 0 .39.07.53.22.14.14.22.33.22.53v2.28c1.92.18 3.72 1.02 5.08 2.39a8.24 8.24 0 0 1 2.39 5.08h2.28c.2 0 .39.07.53.22.14.14.22.33.22.53" /></Svg>;
export { SolidGps as ReactComponent };
