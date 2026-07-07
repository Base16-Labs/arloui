import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCircleHalf = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.25c-1.93 0-3.81.57-5.42 1.64a9.8 9.8 0 0 0-3.59 4.38 9.7 9.7 0 0 0-.55 5.63c.37 1.89 1.3 3.63 2.67 4.99 1.36 1.37 3.1 2.3 4.99 2.67 1.89.38 3.85.19 5.63-.55a9.8 9.8 0 0 0 4.38-3.59 9.75 9.75 0 0 0-1.22-12.31A9.73 9.73 0 0 0 12 2.25m.75 1.53c.51.05 1.01.15 1.5.29v15.87c-.49.14-.99.23-1.5.28zm3 .87c.53.28 1.04.61 1.5.99v12.72c-.46.38-.97.71-1.5.99zM3.75 12c0-2.06.77-4.04 2.16-5.56a8.27 8.27 0 0 1 5.34-2.66v16.44a8.27 8.27 0 0 1-5.34-2.66A8.23 8.23 0 0 1 3.75 12m15 4.74V7.26c.98 1.39 1.5 3.04 1.5 4.74s-.52 3.35-1.5 4.74" /></Svg>;
export { OutlineCircleHalf as ReactComponent };
