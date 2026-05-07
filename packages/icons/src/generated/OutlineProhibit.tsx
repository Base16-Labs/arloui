import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineProhibit = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12 2.25c-1.93 0-3.81.57-5.42 1.64a9.8 9.8 0 0 0-3.59 4.38 9.7 9.7 0 0 0-.55 5.63c.37 1.89 1.3 3.63 2.67 4.99a9.7 9.7 0 0 0 4.99 2.67c1.89.38 3.85.18 5.63-.55a9.8 9.8 0 0 0 4.38-3.59A9.8 9.8 0 0 0 21.75 12c0-2.59-1.03-5.07-2.86-6.89A9.73 9.73 0 0 0 12 2.25M20.25 12c0 1.93-.68 3.8-1.91 5.27L6.72 5.66c1.21-1 2.67-1.64 4.23-1.84 1.55-.2 3.13.05 4.55.71a8.3 8.3 0 0 1 3.46 3.04A8.3 8.3 0 0 1 20.25 12m-16.5 0c0-1.93.68-3.8 1.91-5.28l11.62 11.62c-1.21 1-2.67 1.64-4.23 1.84-1.55.2-3.13-.05-4.55-.72a8.2 8.2 0 0 1-3.46-3.04A8.23 8.23 0 0 1 3.75 12" /></Svg>;
export { OutlineProhibit as ReactComponent };
