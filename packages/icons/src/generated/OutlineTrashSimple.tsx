import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTrashSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 5.25H3.75a.751.751 0 0 0 0 1.5h.75v13.5c0 .4.158.78.439 1.06s.663.44 1.061.44h12c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V6.75h.75a.751.751 0 0 0 0-1.5m-2.25 15H6V6.75h12zM7.5 3a.751.751 0 0 1 .75-.75h7.5a.751.751 0 0 1 0 1.5h-7.5A.75.75 0 0 1 7.5 3" /></Svg>;
export { OutlineTrashSimple as ReactComponent };
