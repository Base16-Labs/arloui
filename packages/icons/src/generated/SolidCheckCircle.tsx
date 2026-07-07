import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCheckCircle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.25c-1.93 0-3.81.57-5.42 1.64a9.74 9.74 0 0 0-3.59 4.38 9.7 9.7 0 0 0-.55 5.63c.37 1.89 1.3 3.63 2.67 4.99a9.7 9.7 0 0 0 4.99 2.67c1.89.38 3.85.18 5.63-.55a9.75 9.75 0 0 0 4.38-3.6A9.72 9.72 0 0 0 21.75 12c0-2.59-1.03-5.07-2.86-6.89A9.73 9.73 0 0 0 12 2.25m4.28 8.03-5.25 5.25a.78.78 0 0 1-.53.22.776.776 0 0 1-.53-.22l-2.25-2.25a.75.75 0 1 1 1.06-1.06l1.72 1.72 4.72-4.72c.07-.07.15-.13.24-.17a1 1 0 0 1 .29-.05c.1 0 .2.02.29.05.09.04.17.1.24.17s.13.15.16.24a.72.72 0 0 1 0 .57c-.03.1-.09.18-.16.25" /></Svg>;
export { SolidCheckCircle as ReactComponent };
