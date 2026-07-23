import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineNotepad = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M15.75 12.375a.751.751 0 0 1-.75.75H9a.751.751 0 0 1 0-1.5h6a.75.75 0 0 1 .75.75m-.75 2.25H9a.751.751 0 0 0 0 1.5h6a.751.751 0 0 0 0-1.5m5.25-10.5v15c0 .79-.316 1.55-.879 2.12a3 3 0 0 1-2.121.88H6.75a3 3 0 0 1-2.121-.88 3.02 3.02 0 0 1-.879-2.12v-15a.751.751 0 0 1 .75-.75h2.25v-.75a.751.751 0 0 1 1.5 0v.75h3v-.75a.751.751 0 0 1 1.5 0v.75h3v-.75a.751.751 0 0 1 1.5 0v.75h2.25a.75.75 0 0 1 .75.75m-1.5.75h-1.5v.75a.751.751 0 0 1-1.5 0v-.75h-3v.75a.751.751 0 0 1-1.5 0v-.75h-3v.75a.751.751 0 0 1-1.5 0v-.75h-1.5v14.25c0 .39.158.78.439 1.06s.663.44 1.061.44h10.5c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06z" /></Svg>;
export { OutlineNotepad as ReactComponent };
