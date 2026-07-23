import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCrop = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3m-8.25 4.5h4.5a.75.75 0 0 1 .75.75v4.5a.751.751 0 0 1-1.5 0V9h-3.75a.751.751 0 0 1 0-1.5m6.75 9h-1.5V18a.751.751 0 0 1-1.5 0v-1.5H8.25a.75.75 0 0 1-.75-.75V9H6a.751.751 0 0 1 0-1.5h1.5V6A.751.751 0 0 1 9 6v9h9a.751.751 0 0 1 0 1.5" /></Svg>;
export { OutlineCrop as ReactComponent };
