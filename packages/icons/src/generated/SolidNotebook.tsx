import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNotebook = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.15-1.061.44C3.158 3.72 3 4.1 3 4.5v15c0 .39.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.89 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 19.5 3m-12 16.5h-3v-15h3zm9-5.25h-6a.751.751 0 0 1 0-1.5h6a.751.751 0 0 1 0 1.5m0-3h-6a.751.751 0 0 1 0-1.5h6a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidNotebook as ReactComponent };
