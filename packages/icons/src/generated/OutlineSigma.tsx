import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSigma = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M17.25 6.75v-1.5H7.561l5.025 6.28a.75.75 0 0 1 0 .94l-5.025 6.28h9.69v-1.5a.753.753 0 0 1 1.28-.53c.14.14.22.33.22.53v2.25a.753.753 0 0 1-.75.75H6a.7.7 0 0 1-.4-.12.755.755 0 0 1-.346-.72.74.74 0 0 1 .16-.38L11.038 12 5.414 4.97A.755.755 0 0 1 5.6 3.86c.12-.07.259-.11.4-.11h12a.753.753 0 0 1 .75.75v2.25a.753.753 0 0 1-1.28.53.75.75 0 0 1-.22-.53" /></Svg>;
export { OutlineSigma as ReactComponent };
