import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineNotification = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.875 12.375v7.5c0 .39-.158.78-.439 1.06s-.663.44-1.061.44H4.125c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06V5.625c0-.4.158-.78.439-1.06.282-.29.663-.44 1.061-.44h7.5a.751.751 0 0 1 0 1.5h-7.5v14.25h14.25v-7.5a.751.751 0 0 1 1.5 0m1.5-6.38c0 .67-.198 1.32-.569 1.88-.371.55-.898.98-1.514 1.24a3.38 3.38 0 0 1-3.678-.73 3.4 3.4 0 0 1-.924-1.73A3.37 3.37 0 0 1 18 2.625c.895 0 1.754.35 2.386.98.633.64.989 1.5.989 2.39m-1.5 0a1.876 1.876 0 0 0-2.241-1.84c-.364.07-.698.25-.96.52a1.867 1.867 0 0 0 .284 2.88c.309.21.671.32 1.042.32a1.88 1.88 0 0 0 1.875-1.88" /></Svg>;
export { OutlineNotification as ReactComponent };
