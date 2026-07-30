import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDiceOne = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18 3H6a3 3 0 0 0-2.121.88A2.98 2.98 0 0 0 3 6v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6c0-.8-.316-1.56-.879-2.12A3 3 0 0 0 18 3m-6 10.12c-.223 0-.44-.06-.625-.19a1.08 1.08 0 0 1-.415-.5 1.13 1.13 0 0 1 .244-1.23c.158-.15.358-.26.576-.3.219-.05.445-.03.65.06s.382.23.505.41c.124.19.19.41.19.63 0 .3-.119.58-.33.79-.211.22-.497.33-.795.33" /></Svg>;
export { SolidDiceOne as ReactComponent };
