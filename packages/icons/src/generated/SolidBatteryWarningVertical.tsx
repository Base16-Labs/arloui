import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBatteryWarningVertical = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M8.25 1.125c0-.199.079-.39.22-.53A.75.75 0 0 1 9 .375h6c.199 0 .39.079.53.22a.747.747 0 0 1 0 1.06.75.75 0 0 1-.53.22H9a.75.75 0 0 1-.53-.22.75.75 0 0 1-.22-.53m10.5 4.5v15.75a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25V5.625a2.25 2.25 0 0 1 2.25-2.25h9a2.25 2.25 0 0 1 2.25 2.25m-7.5 7.5c0 .199.079.39.22.53a.747.747 0 0 0 1.06 0 .75.75 0 0 0 .22-.53v-3.75a.75.75 0 0 0-.22-.53.747.747 0 0 0-1.06 0 .75.75 0 0 0-.22.53zm1.875 3.375a1.12 1.12 0 0 0-.694-1.039 1.1 1.1 0 0 0-.65-.064 1.12 1.12 0 0 0-.884.883c-.044.219-.022.445.064.65a1.12 1.12 0 0 0 1.039.695 1.123 1.123 0 0 0 1.125-1.125" /></Svg>;
export { SolidBatteryWarningVertical as ReactComponent };
