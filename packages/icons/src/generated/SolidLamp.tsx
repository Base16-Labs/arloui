import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidLamp = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M23.13 14.66c-.07.1-.16.19-.27.25a.9.9 0 0 1-.36.09h-3v3a.75.75 0 1 1-1.5 0v-3h-5.25v4.5H15c.2 0 .39.07.53.22A.75.75 0 0 1 15 21H9a.75.75 0 0 1-.53-1.28.7.7 0 0 1 .53-.22h2.25V15H1.5a.9.9 0 0 1-.36-.09c-.1-.06-.2-.15-.27-.25a.741.741 0 0 1-.06-.71l4.5-10.5A.74.74 0 0 1 6 3h12a.744.744 0 0 1 .69.45l4.5 10.5c.05.11.07.24.06.36-.01.13-.06.24-.12.35" /></Svg>;
export { SolidLamp as ReactComponent };
