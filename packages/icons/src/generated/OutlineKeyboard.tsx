import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineKeyboard = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 4.5H3c-.398 0-.779.15-1.061.44C1.658 5.22 1.5 5.6 1.5 6v12c0 .39.158.78.439 1.06s.663.44 1.061.44h18c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06V6c0-.4-.158-.78-.439-1.06A1.47 1.47 0 0 0 21 4.5M21 18H3V6h18zm-1.5-6a.751.751 0 0 1-.75.75H5.25a.751.751 0 0 1 0-1.5h13.5c.199 0 .39.07.53.22.141.14.22.33.22.53m0-3a.751.751 0 0 1-.75.75H5.25a.751.751 0 0 1 0-1.5h13.5c.199 0 .39.07.53.22.141.14.22.33.22.53M6.75 15a.751.751 0 0 1-.75.75h-.75a.751.751 0 0 1 0-1.5H6c.199 0 .39.07.53.22.141.14.22.33.22.53m9 0a.751.751 0 0 1-.75.75H9a.751.751 0 0 1 0-1.5h6c.199 0 .39.07.53.22.141.14.22.33.22.53m3.75 0a.751.751 0 0 1-.75.75H18a.751.751 0 0 1 0-1.5h.75c.199 0 .39.07.53.22.141.14.22.33.22.53" /></Svg>;
export { OutlineKeyboard as ReactComponent };
export { OutlineKeyboard };
export default OutlineKeyboard;
