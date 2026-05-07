import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTrash = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 5.25H16.5V4.5a2.256 2.256 0 0 0-2.25-2.25h-4.5c-.597 0-1.169.24-1.591.66S7.5 3.91 7.5 4.5v.75H3.75A.753.753 0 0 0 3 6a.753.753 0 0 0 .75.75h.75v13.5a1.506 1.506 0 0 0 1.5 1.5h12c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V6.75h.75a.751.751 0 0 0 0-1.5M10.5 16.5a.751.751 0 0 1-1.5 0v-6a.751.751 0 0 1 1.5 0zm4.5 0a.751.751 0 0 1-1.5 0v-6a.751.751 0 0 1 1.5 0zm0-11.25H9V4.5a.751.751 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75z" /></Svg>;
export { SolidTrash as ReactComponent };
