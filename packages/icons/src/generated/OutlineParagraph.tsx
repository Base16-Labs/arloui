import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineParagraph = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.875 3.75h-10.5a5.993 5.993 0 0 0-6 6 6.012 6.012 0 0 0 6 6h3.75v3.75a.75.75 0 0 0 1.5 0V5.25h2.25V19.5a.75.75 0 0 0 1.5 0V5.25h1.5a.75.75 0 0 0 0-1.5m-6.75 10.5h-3.75c-1.19 0-2.34-.48-3.18-1.32a4.5 4.5 0 0 1-1.32-3.18c0-1.2.47-2.34 1.32-3.19.84-.84 1.99-1.31 3.18-1.31h3.75z" /></Svg>;
export { OutlineParagraph as ReactComponent };
