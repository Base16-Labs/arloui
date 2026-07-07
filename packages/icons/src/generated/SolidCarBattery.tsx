import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCarBattery = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 7.5h-1.5V6c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 18 4.5h-3c-.398 0-.779.16-1.061.44S13.5 5.6 13.5 6v1.5h-3V6c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 9 4.5H6c-.398 0-.779.16-1.061.44S4.5 5.6 4.5 6v1.5H3c-.398 0-.779.16-1.061.44S1.5 8.6 1.5 9v9c0 .4.158.78.439 1.06s.663.44 1.061.44h18c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V9c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 21 7.5M6 6h3v1.5H6zm3.75 8.25h-3a.751.751 0 0 1 0-1.5h3a.751.751 0 0 1 0 1.5m7.5 0h-.75V15a.751.751 0 0 1-1.5 0v-.75h-.75a.751.751 0 0 1 0-1.5H15V12a.751.751 0 0 1 1.5 0v.75h.75a.751.751 0 0 1 0 1.5M18 7.5h-3V6h3z" /></Svg>;
export { SolidCarBattery as ReactComponent };
