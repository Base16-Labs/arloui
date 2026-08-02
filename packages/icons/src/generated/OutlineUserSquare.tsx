import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineUserSquare = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.499 1.499 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3M9 11.25a2.989 2.989 0 0 1 1.85-2.77c.55-.23 1.15-.29 1.73-.17s1.12.4 1.54.82.7.95.82 1.54c.12.58.06 1.18-.17 1.73A2.99 2.99 0 0 1 12 14.25c-.8 0-1.56-.31-2.12-.88-.57-.56-.88-1.32-.88-2.12M6.43 19.5c.39-.94 1.01-1.78 1.8-2.42A6.02 6.02 0 0 1 12 15.75c1.37 0 2.7.47 3.77 1.33a6.04 6.04 0 0 1 1.79 2.42zm13.07 0h-.35c-.33-1.06-.9-2.03-1.65-2.85a7.6 7.6 0 0 0-2.72-1.86 4.5 4.5 0 0 0 1.53-2.27c.27-.9.25-1.86-.06-2.74-.31-.89-.88-1.65-1.64-2.2a4.52 4.52 0 0 0-5.22 0c-.77.55-1.34 1.31-1.65 2.2-.3.88-.32 1.84-.06 2.74s.8 1.69 1.54 2.27a7.4 7.4 0 0 0-2.72 1.86c-.76.82-1.33 1.79-1.66 2.85H4.5v-15h15z" /></Svg>;
export { OutlineUserSquare as ReactComponent };
export { OutlineUserSquare };
export default OutlineUserSquare;
