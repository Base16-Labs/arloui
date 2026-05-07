import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidShare = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m21.53 9.528-4.5 4.5a.718.718 0 0 1-.818.16.7.7 0 0 1-.336-.27.8.8 0 0 1-.127-.42v-3.75h-.28a8.26 8.26 0 0 0-7.991 6.19.76.76 0 0 1-.345.46.75.75 0 0 1-.57.08.764.764 0 0 1-.538-.92 9.74 9.74 0 0 1 9.444-7.31h.28v-3.75q.001-.225.127-.42a.7.7 0 0 1 .336-.27.7.7 0 0 1 .433-.04c.146.02.28.1.386.2l4.5 4.5a.75.75 0 0 1 0 1.06M18 18.748H3.75V7.498a.751.751 0 0 0-1.5 0v12a.751.751 0 0 0 .75.75h15a.751.751 0 0 0 0-1.5" /></Svg>;
export { SolidShare as ReactComponent };
