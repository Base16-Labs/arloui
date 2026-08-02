import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBatteryWarning = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M23.625 9v6c0 .199-.079.39-.22.53a.747.747 0 0 1-1.06 0 .75.75 0 0 1-.22-.53V9c0-.199.079-.39.22-.53a.747.747 0 0 1 1.06 0c.141.14.22.331.22.53m-3-1.5v9a2.25 2.25 0 0 1-2.25 2.25H2.625a2.25 2.25 0 0 1-2.25-2.25v-9a2.25 2.25 0 0 1 2.25-2.25h15.75a2.25 2.25 0 0 1 2.25 2.25m-1.5 0a.75.75 0 0 0-.22-.53.75.75 0 0 0-.53-.22H2.625a.75.75 0 0 0-.53.22.75.75 0 0 0-.22.53v9c0 .199.079.39.22.53.14.141.331.22.53.22h15.75c.199 0 .39-.079.53-.22a.75.75 0 0 0 .22-.53zM10.5 12.375c.199 0 .39-.079.53-.22a.75.75 0 0 0 .22-.53V9a.75.75 0 0 0-.22-.53.747.747 0 0 0-1.06 0 .75.75 0 0 0-.22.53v2.625c0 .199.079.39.22.53.14.141.331.22.53.22m0 1.125a1.12 1.12 0 0 0-1.039.694 1.1 1.1 0 0 0-.064.65c.043.219.15.419.308.576a1.122 1.122 0 0 0 1.92-.795A1.127 1.127 0 0 0 10.5 13.5" /></Svg>;
export { OutlineBatteryWarning as ReactComponent };
export { OutlineBatteryWarning };
export default OutlineBatteryWarning;
