import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBatteryWarning = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.375 5.25H2.625A2.25 2.25 0 0 0 .375 7.5v9a2.25 2.25 0 0 0 2.25 2.25h15.75a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25m-8.625 3c0-.199.079-.39.22-.53a.747.747 0 0 1 1.06 0c.141.14.22.331.22.53V12c0 .199-.079.39-.22.53a.747.747 0 0 1-1.06 0 .75.75 0 0 1-.22-.53zm.75 8.25a1.12 1.12 0 0 1-1.039-.695 1.12 1.12 0 0 1 .82-1.533 1.12 1.12 0 0 1 1.344 1.103A1.125 1.125 0 0 1 10.5 16.5M23.625 9v6c0 .199-.079.39-.22.53a.747.747 0 0 1-1.06 0 .75.75 0 0 1-.22-.53V9c0-.199.079-.39.22-.53a.747.747 0 0 1 1.06 0c.141.14.22.331.22.53" /></Svg>;
export { SolidBatteryWarning as ReactComponent };
