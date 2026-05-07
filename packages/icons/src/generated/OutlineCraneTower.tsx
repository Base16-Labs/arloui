import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCraneTower = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.125 7.5H9.838L7.796 3.42a.8.8 0 0 0-.276-.31.8.8 0 0 0-.395-.11h-3a.75.75 0 0 0-.75.75V7.5h-1.5a.751.751 0 0 0 0 1.5h1.5v10.5h-1.5a.751.751 0 0 0 0 1.5h9.75a.751.751 0 0 0 0-1.5h-1.5V9h9v8.25h-1.5v-.75a.751.751 0 0 0-1.5 0v.75c0 .4.158.78.439 1.06s.663.44 1.061.44h1.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V9h1.5a.751.751 0 0 0 0-1.5m-17.25-3h1.787l1.5 3H4.875zm0 15V15h3.75v4.5zm3.75-6h-3.75V9h3.75z" /></Svg>;
export { OutlineCraneTower as ReactComponent };
