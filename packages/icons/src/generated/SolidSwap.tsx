import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSwap = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 4.5v9.75a1.5 1.5 0 0 1-1.5 1.5h-9v1.5c0 .15-.04.29-.13.42-.08.12-.2.22-.33.27a.72.72 0 0 1-.82-.16l-2.25-2.25a.6.6 0 0 1-.16-.24.72.72 0 0 1 0-.58c.03-.09.09-.17.16-.24l2.25-2.25c.1-.1.24-.18.38-.2a.74.74 0 0 1 .77.31c.09.13.13.27.13.42v1.5h9V4.5H9v.75a.75.75 0 0 1-1.5 0V4.5A1.5 1.5 0 0 1 9 3h10.5A1.5 1.5 0 0 1 21 4.5M15.75 18a.75.75 0 0 0-.75.75v.75H4.5V9.75h9v1.5c0 .15.04.29.13.42.08.12.2.22.33.27a.72.72 0 0 0 .82-.16l2.25-2.25c.07-.07.13-.15.16-.24a.72.72 0 0 0 0-.58.6.6 0 0 0-.16-.24l-2.25-2.25c-.1-.1-.24-.18-.38-.2a.74.74 0 0 0-.77.31c-.09.13-.13.27-.13.42v1.5h-9A1.5 1.5 0 0 0 3 9.75v9.75A1.5 1.5 0 0 0 4.5 21H15a1.5 1.5 0 0 0 1.5-1.5v-.75a.75.75 0 0 0-.75-.75" /></Svg>;
export { SolidSwap as ReactComponent };
export { SolidSwap };
export default SolidSwap;
