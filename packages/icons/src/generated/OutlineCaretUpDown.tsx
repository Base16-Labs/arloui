import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCaretUpDown = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M17.03 15.97c.07.07.13.15.16.24a.72.72 0 0 1 0 .57c-.03.1-.09.18-.16.25l-4.5 4.5a.78.78 0 0 1-.53.22.776.776 0 0 1-.53-.22l-4.5-4.5a.75.75 0 1 1 1.06-1.06L12 19.94l3.97-3.97c.07-.07.15-.13.24-.17a1 1 0 0 1 .29-.05c.1 0 .2.02.29.05.09.04.17.1.24.17m-9-7.94L12 4.06l3.97 3.97a.75.75 0 1 0 1.06-1.06l-4.5-4.5a.8.8 0 0 0-.24-.17 1 1 0 0 0-.29-.05c-.1 0-.2.02-.29.05-.09.04-.17.1-.24.17l-4.5 4.5a.75.75 0 1 0 1.06 1.06" /></Svg>;
export { OutlineCaretUpDown as ReactComponent };
