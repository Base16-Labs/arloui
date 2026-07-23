import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSortDescending = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3M6.75 6.75h3.75a.751.751 0 0 1 0 1.5H6.75a.751.751 0 0 1 0-1.5m0 4.5h4.5a.751.751 0 0 1 0 1.5h-4.5a.751.751 0 0 1 0-1.5m9 6h-9a.751.751 0 0 1 0-1.5h9a.751.751 0 0 1 0 1.5m2.781-7.72a.78.78 0 0 1-.531.22.782.782 0 0 1-.531-.22l-.969-.97v4.19a.751.751 0 0 1-1.5 0V8.56l-.969.97a.755.755 0 0 1-1.062 0 .75.75 0 0 1 0-1.06l2.25-2.25a.64.64 0 0 1 .244-.16.7.7 0 0 1 .574 0 .64.64 0 0 1 .244.16l2.25 2.25a.75.75 0 0 1 0 1.06" /></Svg>;
export { SolidSortDescending as ReactComponent };
