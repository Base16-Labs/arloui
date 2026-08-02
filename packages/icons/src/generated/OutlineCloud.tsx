import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCloud = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M14.998 3.75c-1.53 0-3.03.43-4.34 1.23a8.34 8.34 0 0 0-3.04 3.33c-.81-.12-1.65-.07-2.44.15-.8.22-1.54.6-2.18 1.11-.64.52-1.17 1.16-1.56 1.89a6.05 6.05 0 0 0-.67 2.35c-.06.83.05 1.65.32 2.43.28.78.71 1.49 1.27 2.09a5.95 5.95 0 0 0 4.39 1.92h8.25c2.19 0 4.29-.87 5.83-2.42a8.22 8.22 0 0 0 2.42-5.83c0-2.19-.87-4.29-2.42-5.83a8.22 8.22 0 0 0-5.83-2.42m0 15h-8.25c-1.19 0-2.34-.47-3.18-1.32a4.47 4.47 0 0 1-1.32-3.18c0-1.19.47-2.34 1.32-3.18a4.47 4.47 0 0 1 3.49-1.31c-.21.73-.31 1.48-.31 2.24a.75.75 0 0 0 1.5 0c0-1.33.4-2.64 1.14-3.75a6.7 6.7 0 0 1 3.03-2.49c1.23-.51 2.59-.64 3.9-.38s2.51.9 3.45 1.85c.95.94 1.59 2.14 1.85 3.45s.13 2.67-.38 3.9a6.7 6.7 0 0 1-2.49 3.03 6.8 6.8 0 0 1-3.75 1.14" /></Svg>;
export { OutlineCloud as ReactComponent };
export { OutlineCloud };
export default OutlineCloud;
