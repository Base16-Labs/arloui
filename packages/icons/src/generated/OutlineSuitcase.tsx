import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSuitcase = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 6H16.5v-.75c0-.6-.237-1.17-.659-1.59A2.26 2.26 0 0 0 14.25 3h-4.5c-.597 0-1.169.24-1.591.66S7.5 4.65 7.5 5.25V6H3.75c-.398 0-.779.16-1.061.44S2.25 7.1 2.25 7.5v12c0 .4.158.78.439 1.06s.663.44 1.061.44h16.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-12c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 20.25 6M9 5.25a.751.751 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75V6H9zm6 2.25v12H9v-12zm-11.25 0H7.5v12H3.75zm16.5 12H16.5v-12h3.75z" /></Svg>;
export { OutlineSuitcase as ReactComponent };
