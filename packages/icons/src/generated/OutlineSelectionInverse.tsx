import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSelectionInverse = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M14.25 20.25a.751.751 0 0 1-.75.75h-3a.751.751 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75m-10.5-6a.75.75 0 0 0 .75-.75v-3a.751.751 0 0 0-1.5 0v3a.751.751 0 0 0 .75.75m3 5.25H4.5v-2.25a.751.751 0 0 0-1.5 0v2.25c0 .4.158.78.439 1.06S4.102 21 4.5 21h2.25a.751.751 0 0 0 0-1.5M21 4.5v15c0 .4-.158.78-.439 1.06s-.663.44-1.061.44h-2.25a.751.751 0 0 1 0-1.5h1.19L4.5 5.56v1.19a.751.751 0 0 1-1.5 0V4.5c0-.4.158-.78.439-1.06S4.102 3 4.5 3h15c.398 0 .779.16 1.061.44S21 4.1 21 4.5m-1.5 0H5.56L19.5 18.44z" /></Svg>;
export { OutlineSelectionInverse as ReactComponent };
