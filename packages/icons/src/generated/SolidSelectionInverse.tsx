import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSelectionInverse = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M14.25 20.25a.751.751 0 0 1-.75.75h-3a.751.751 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75m-10.5-6a.75.75 0 0 0 .75-.75v-3a.751.751 0 0 0-1.5 0v3a.751.751 0 0 0 .75.75m3 5.25H4.5v-2.25a.751.751 0 0 0-1.5 0v2.25c0 .4.158.78.439 1.06S4.102 21 4.5 21h2.25a.751.751 0 0 0 0-1.5M21 4.5c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 3h-15c-.369 0-.726.14-.999.39a.6.6 0 0 0-.116.11A1.5 1.5 0 0 0 3 4.5v2.25a.751.751 0 0 0 1.5 0V5.56L18.44 19.5h-1.19a.751.751 0 0 0 0 1.5h2.25a1.52 1.52 0 0 0 1.06-.44q.03-.03.055-.06c.248-.27.385-.63.385-1z" /></Svg>;
export { SolidSelectionInverse as ReactComponent };
export { SolidSelectionInverse };
export default SolidSelectionInverse;
