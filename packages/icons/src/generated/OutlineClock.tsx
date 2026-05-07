import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineClock = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12 2.25a9.76 9.76 0 0 0-5.417 1.64A9.765 9.765 0 0 0 2.437 13.9a9.74 9.74 0 0 0 2.67 4.99 9.66 9.66 0 0 0 4.991 2.67c1.891.38 3.852.19 5.633-.55a9.8 9.8 0 0 0 4.38-3.59 9.754 9.754 0 0 0-1.219-12.31A9.74 9.74 0 0 0 12 2.25m0 18a8.2 8.2 0 0 1-4.583-1.39 8.3 8.3 0 0 1-3.039-3.7 8.26 8.26 0 0 1-.469-4.77 8.23 8.23 0 0 1 2.257-4.22 8.2 8.2 0 0 1 4.225-2.26c1.6-.32 3.26-.16 4.766.47a8.2 8.2 0 0 1 3.703 3.04A8.23 8.23 0 0 1 20.25 12c0 2.19-.872 4.28-2.419 5.83a8.24 8.24 0 0 1-5.83 2.42M18 12a.751.751 0 0 1-.75.75H12a.75.75 0 0 1-.75-.75V6.75a.751.751 0 0 1 1.5 0v4.5h4.5A.75.75 0 0 1 18 12" /></Svg>;
export { OutlineClock as ReactComponent };
