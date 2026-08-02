import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineWarning = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m22.2 18.005-8.197-14.23A2.333 2.333 0 0 0 12 2.625a2.33 2.33 0 0 0-2.003 1.15l-8.197 14.23a2.208 2.208 0 0 0 0 2.23c.202.35.494.64.846.84s.75.3 1.156.3h16.396a2.278 2.278 0 0 0 2-1.14c.197-.34.301-.72.301-1.11s-.102-.78-.3-1.12m-1.3 1.48a.8.8 0 0 1-.297.29.8.8 0 0 1-.405.1H3.802a.8.8 0 0 1-.404-.1.8.8 0 0 1-.298-.29.73.73 0 0 1-.099-.36c0-.13.036-.26.1-.37L11.3 4.525a.78.78 0 0 1 .702-.4.783.783 0 0 1 .703.4l8.199 14.23a.72.72 0 0 1-.003.73m-9.65-5.61v-3.75a.751.751 0 0 1 1.5 0v3.75a.751.751 0 0 1-1.5 0m1.876 3.38c0 .22-.066.44-.19.62-.123.19-.3.33-.505.42a1.2 1.2 0 0 1-.65.06 1.1 1.1 0 0 1-.575-.31 1.115 1.115 0 0 1-.244-1.22c.085-.21.229-.39.414-.51s.402-.19.625-.19c.298 0 .585.12.796.33.21.21.329.5.329.8" /></Svg>;
export { OutlineWarning as ReactComponent };
export { OutlineWarning };
export default OutlineWarning;
