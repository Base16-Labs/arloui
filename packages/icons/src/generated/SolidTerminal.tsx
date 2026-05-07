import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTerminal = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.398 0-.78.16-1.06.44-.282.28-.44.66-.44 1.06v13.5a1.506 1.506 0 0 0 1.5 1.5h16.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M7.28 16.28a.754.754 0 0 1-1.06 0 .746.746 0 0 1 0-1.06L9.44 12 6.22 8.78a.746.746 0 0 1 0-1.06.754.754 0 0 1 1.06 0l3.751 3.75c.069.07.125.15.162.25.038.09.058.18.058.28a.75.75 0 0 1-.22.53zM18 16.5h-6a.751.751 0 0 1 0-1.5h6a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidTerminal as ReactComponent };
