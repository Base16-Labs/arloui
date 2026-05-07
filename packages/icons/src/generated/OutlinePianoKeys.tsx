import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePianoKeys = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.15-1.061.44C3.158 3.72 3 4.1 3 4.5v15c0 .39.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.89 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 19.5 3m-12 1.5h2.25v8.25H7.5zm3 9.75a.75.75 0 0 0 .75-.75v-9h1.5v9a.751.751 0 0 0 .75.75h.75v5.25h-4.5v-5.25zm3.75-1.5V4.5h2.25v8.25zM4.5 4.5H6v9a.751.751 0 0 0 .75.75h1.5v5.25H4.5zm15 15h-3.75v-5.25h1.5a.75.75 0 0 0 .75-.75v-9h1.5z" /></Svg>;
export { OutlinePianoKeys as ReactComponent };
