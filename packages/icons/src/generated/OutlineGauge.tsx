import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineGauge = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.412 7.945a10.4 10.4 0 0 0-3.4-2.28A10.6 10.6 0 0 0 12 4.875h-.038C6.194 4.895 1.5 9.655 1.5 15.485v2.14c0 .4.158.78.439 1.06s.663.44 1.061.44h18c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-2.25c.004-1.38-.267-2.75-.797-4.03a10.4 10.4 0 0 0-2.291-3.4M21 17.625h-9.777l5.134-7.06a.74.74 0 0 0 .134-.55.73.73 0 0 0-.299-.49.747.747 0 0 0-1.049.16l-5.776 7.94H3v-2.14c0-.29.014-.58.04-.86h2.21a.751.751 0 0 0 0-1.5H3.307c.967-3.64 4.125-6.39 7.943-6.72v2.22a.751.751 0 0 0 1.5 0v-2.22c1.861.16 3.627.89 5.054 2.09a9.07 9.07 0 0 1 2.915 4.63H18.75a.751.751 0 0 0 0 1.5h2.219q.03.375.031.75z" /></Svg>;
export { OutlineGauge as ReactComponent };
