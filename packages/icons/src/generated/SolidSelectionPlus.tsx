import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSelectionPlus = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5v-15c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3M5.25 6.75c0-.4.158-.78.439-1.06s.663-.44 1.061-.44H9a.751.751 0 0 1 0 1.5H6.75V9a.751.751 0 0 1-1.5 0zm5.25 10.5H6.75c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06v-3a.751.751 0 0 1 1.5 0v3h3.75a.751.751 0 0 1 0 1.5M12 6a.751.751 0 0 1 .75-.75h3c.398 0 .779.16 1.061.44s.439.66.439 1.06v3.75a.751.751 0 0 1-1.5 0V6.75h-3A.75.75 0 0 1 12 6m6.75 11.25h-1.5v1.5a.751.751 0 0 1-1.5 0v-1.5h-1.5a.751.751 0 0 1 0-1.5h1.5v-1.5a.751.751 0 0 1 1.5 0v1.5h1.5a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidSelectionPlus as ReactComponent };
export { SolidSelectionPlus };
export default SolidSelectionPlus;
