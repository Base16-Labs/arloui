import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineProhibitInset = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M15.53 14.47c.07.07.13.15.16.24a.72.72 0 0 1 0 .58c-.03.09-.09.17-.16.24a.78.78 0 0 1-.53.22.776.776 0 0 1-.53-.22l-6-6a.75.75 0 1 1 1.06-1.06zM21.75 12c0 1.93-.57 3.81-1.64 5.42a9.8 9.8 0 0 1-4.38 3.59c-1.78.73-3.74.93-5.63.55a9.7 9.7 0 0 1-4.99-2.67 9.65 9.65 0 0 1-2.67-4.99c-.38-1.89-.19-3.85.55-5.63a9.8 9.8 0 0 1 3.59-4.38A9.8 9.8 0 0 1 12 2.25c2.59 0 5.06 1.03 6.89 2.86A9.72 9.72 0 0 1 21.75 12m-1.5 0c0-1.63-.48-3.23-1.39-4.59a8.3 8.3 0 0 0-3.7-3.03 8.2 8.2 0 0 0-4.77-.47c-1.6.32-3.07 1.1-4.22 2.25a8.26 8.26 0 0 0-1.79 9A8.255 8.255 0 0 0 12 20.25c2.19 0 4.28-.87 5.83-2.42A8.24 8.24 0 0 0 20.25 12" /></Svg>;
export { OutlineProhibitInset as ReactComponent };
