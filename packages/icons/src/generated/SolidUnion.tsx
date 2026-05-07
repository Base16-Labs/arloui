import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidUnion = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.4 0-.78.16-1.06.44C3.15 3.72 3 4.1 3 4.5v15c0 .4.15.78.44 1.06.28.28.66.44 1.06.44h15a1.499 1.499 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3m-2.25 9.75c0 1.39-.56 2.73-1.54 3.71-.99.99-2.32 1.54-3.71 1.54a5.243 5.243 0 0 1-5.25-5.25V7.5a.75.75 0 0 1 1.5 0v5.25c0 1 .39 1.95 1.1 2.65.7.71 1.65 1.1 2.65 1.1.99 0 1.95-.39 2.65-1.1.7-.7 1.1-1.65 1.1-2.65V7.5a.75.75 0 0 1 1.5 0z" /></Svg>;
export { SolidUnion as ReactComponent };
