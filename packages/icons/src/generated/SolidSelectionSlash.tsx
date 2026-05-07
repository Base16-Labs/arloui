import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSelectionSlash = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3m-5.25 2.25h3c.398 0 .779.16 1.061.44s.439.66.439 1.06v3a.751.751 0 0 1-1.5 0v-3h-3a.751.751 0 0 1 0-1.5m-4.5 13.5h-3c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06v-3a.751.751 0 0 1 1.5 0v3h3a.751.751 0 0 1 0 1.5m9.531.53a.64.64 0 0 1-.244.16.7.7 0 0 1-.574 0 .64.64 0 0 1-.244-.16l-.529-.53h-3.44a.751.751 0 0 1 0-1.5h1.94L6.75 7.81v1.94a.751.751 0 0 1-1.5 0V6.31l-.531-.53a.75.75 0 0 1 0-1.06.755.755 0 0 1 1.062 0l.75.75 12.75 12.75a.75.75 0 0 1 0 1.06" /></Svg>;
export { SolidSelectionSlash as ReactComponent };
