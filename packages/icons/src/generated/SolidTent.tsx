import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTent = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m23.94 18.45-6-13.5a.8.8 0 0 0-.28-.33.73.73 0 0 0-.41-.12H6.75a.73.73 0 0 0-.41.12c-.12.08-.22.2-.28.33v.01l-6 13.49c-.05.11-.07.24-.06.36.01.13.05.25.12.35.07.11.16.19.27.25s.24.09.36.09h22.5c.12 0 .25-.03.36-.09s.2-.14.27-.25c.07-.1.11-.22.12-.35a.74.74 0 0 0-.06-.36M6 18H1.9L6 8.79zm1.5 0V8.79L11.6 18z" /></Svg>;
export { SolidTent as ReactComponent };
