import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTextItalic = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3m-3 4.5h-2.096l-3.215 9h1.561a.751.751 0 0 1 0 1.5H7.5a.751.751 0 0 1 0-1.5h2.096l3.215-9H11.25a.751.751 0 0 1 0-1.5h5.25a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidTextItalic as ReactComponent };
