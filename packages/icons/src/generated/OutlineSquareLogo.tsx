import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSquareLogo = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.78.16-1.06.44C3.157 3.72 3 4.1 3 4.5v15A1.506 1.506 0 0 0 4.5 21h15c.398 0 .78-.16 1.06-.44.282-.28.44-.66.44-1.06v-15A1.506 1.506 0 0 0 19.5 3m0 16.5h-15v-15h15zM15 8.25H9a.753.753 0 0 0-.75.75v6a.753.753 0 0 0 .75.75h6a.753.753 0 0 0 .75-.75V9a.753.753 0 0 0-.75-.75m-.75 6h-4.5v-4.5h4.5z" /></Svg>;
export { OutlineSquareLogo as ReactComponent };
