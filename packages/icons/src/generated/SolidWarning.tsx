import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWarning = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m22.2 18.005-8.197-14.23A2.333 2.333 0 0 0 12 2.625a2.33 2.33 0 0 0-2.003 1.15l-8.197 14.23a2.208 2.208 0 0 0 0 2.23c.202.35.494.64.846.84s.75.3 1.156.3h16.396a2.278 2.278 0 0 0 2-1.14c.197-.34.301-.72.301-1.11s-.102-.78-.3-1.12m-10.95-7.88a.751.751 0 0 1 1.5 0v3.75a.751.751 0 0 1-1.5 0zm.75 8.25c-.222 0-.44-.07-.624-.19-.185-.12-.33-.3-.415-.5a1.13 1.13 0 0 1 .82-1.54c.218-.04.444-.02.65.07a1.11 1.11 0 0 1 .695 1.04A1.125 1.125 0 0 1 12 18.375" /></Svg>;
export { SolidWarning as ReactComponent };
