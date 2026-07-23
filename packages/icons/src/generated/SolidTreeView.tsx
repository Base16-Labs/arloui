import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTreeView = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M14.25 12.75V12H7.5v6a.75.75 0 0 0 .75.75h6V18a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-.75h-6c-.6 0-1.17-.23-1.59-.66C6.24 19.17 6 18.6 6 18V7.5h-.75A1.5 1.5 0 0 1 3.75 6V3a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 9.75 3v3a1.5 1.5 0 0 1-1.5 1.5H7.5v3h6.75v-.75a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5" /></Svg>;
export { SolidTreeView as ReactComponent };
