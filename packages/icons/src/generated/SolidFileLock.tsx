import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFileLock = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M11.25 16.5h-.75v-.37a2.625 2.625 0 1 0-5.25 0v.37H4.5a.75.75 0 0 0-.75.75V21a.751.751 0 0 0 .75.75h6.75A.75.75 0 0 0 12 21v-3.75a.751.751 0 0 0-.75-.75M9 16.5H6.75v-.37A1.127 1.127 0 0 1 7.875 15 1.127 1.127 0 0 1 9 16.13zm11.031-8.78-5.25-5.25a.78.78 0 0 0-.531-.22h-9c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06V12a.751.751 0 0 0 1.5 0V3.75h8.25v4.5a.751.751 0 0 0 .75.75h4.5v11.25H15a.751.751 0 0 0 0 1.5h3.75c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-12c0-.1-.019-.19-.057-.29a.8.8 0 0 0-.162-.24M15 4.81l2.69 2.69H15z" /></Svg>;
export { SolidFileLock as ReactComponent };
