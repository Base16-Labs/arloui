import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBed = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 6.75H2.25V4.5a.75.75 0 0 0-.22-.53.747.747 0 0 0-1.06 0 .75.75 0 0 0-.22.53v15c0 .199.079.39.22.53a.747.747 0 0 0 1.06 0 .75.75 0 0 0 .22-.53v-3h19.5v3c0 .199.079.39.22.53a.747.747 0 0 0 1.06 0 .75.75 0 0 0 .22-.53v-9a3.75 3.75 0 0 0-3.75-3.75M2.25 8.25H9V15H2.25zM10.5 15V8.25h9a2.25 2.25 0 0 1 2.25 2.25V15z" /></Svg>;
export { OutlineBed as ReactComponent };
