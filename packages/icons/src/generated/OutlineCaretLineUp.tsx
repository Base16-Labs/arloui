import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCaretLineUp = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.03 18.155a.78.78 0 0 1-.53.22.776.776 0 0 1-.53-.22L12 11.185l-6.97 6.97a.75.75 0 1 1-1.06-1.06l7.5-7.5c.07-.07.15-.13.24-.17a1 1 0 0 1 .29-.05c.1 0 .2.02.29.05.09.04.17.1.24.17l7.5 7.5c.07.07.13.15.16.24a.72.72 0 0 1 0 .57c-.03.1-.09.18-.16.25M4.5 7.125h15a.75.75 0 0 0 0-1.5h-15a.75.75 0 0 0 0 1.5" /></Svg>;
export { OutlineCaretLineUp as ReactComponent };
