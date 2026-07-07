import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCopySimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M17.25 6H3.75a.75.75 0 0 0-.75.75v13.5a.751.751 0 0 0 .75.75h13.5a.75.75 0 0 0 .75-.75V6.75a.751.751 0 0 0-.75-.75m-.75 13.5h-12v-12h12zM21 3.75v13.5a.751.751 0 0 1-1.5 0V4.5H6.75a.751.751 0 0 1 0-1.5h13.5a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineCopySimple as ReactComponent };
