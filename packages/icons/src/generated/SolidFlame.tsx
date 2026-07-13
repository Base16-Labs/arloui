import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFlame = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M16.293 5.205a20.7 20.7 0 0 0-3.907-3.22.75.75 0 0 0-.386-.11c-.136 0-.27.04-.386.11a20.7 20.7 0 0 0-3.907 3.22c-2.589 2.72-3.957 5.71-3.957 8.67 0 2.19.869 4.29 2.416 5.83a8.244 8.244 0 0 0 11.668 0 8.23 8.23 0 0 0 2.416-5.83c0-2.96-1.368-5.95-3.957-8.67M9 17.625c0-2.59 2.112-4.43 3-5.09.889.66 3 2.5 3 5.09 0 .8-.316 1.56-.879 2.12a3 3 0 0 1-2.121.88 3 3 0 0 1-2.121-.88A2.98 2.98 0 0 1 9 17.625" /></Svg>;
export { SolidFlame as ReactComponent };
