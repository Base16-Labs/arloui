import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCaretCircleUpDown = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12 2.25c-1.93 0-3.81.57-5.42 1.64a9.74 9.74 0 0 0-3.59 4.38 9.7 9.7 0 0 0-.55 5.63c.37 1.89 1.3 3.63 2.67 4.99a9.7 9.7 0 0 0 4.99 2.67c1.89.38 3.85.18 5.63-.55a9.75 9.75 0 0 0 4.38-3.6A9.72 9.72 0 0 0 21.75 12c0-2.59-1.03-5.07-2.86-6.89A9.73 9.73 0 0 0 12 2.25m3.53 12.53-3 3A.78.78 0 0 1 12 18a.776.776 0 0 1-.53-.22l-3-3a.75.75 0 1 1 1.06-1.06L12 16.19l2.47-2.47a.75.75 0 1 1 1.06 1.06m0-4.5a.78.78 0 0 1-.53.22.776.776 0 0 1-.53-.22L12 7.81l-2.47 2.47a.75.75 0 1 1-1.06-1.06l3-3c.07-.07.15-.13.24-.17A1 1 0 0 1 12 6c.1 0 .2.02.29.05.09.04.17.1.24.17l3 3c.07.07.13.15.16.24a.72.72 0 0 1 0 .57c-.03.1-.09.18-.16.25" /></Svg>;
export { SolidCaretCircleUpDown as ReactComponent };
