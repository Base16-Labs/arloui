import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDot = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 7.5c-.89 0-1.76.26-2.5.76a4.43 4.43 0 0 0-1.657 2.02 4.495 4.495 0 0 0 3.279 6.13 4.45 4.45 0 0 0 2.6-.25A4.51 4.51 0 0 0 16.5 12c0-1.19-.474-2.34-1.318-3.18A4.48 4.48 0 0 0 12 7.5m0 5.62c-.223 0-.44-.06-.625-.19a1.115 1.115 0 0 1-.478-1.15c.043-.22.15-.42.308-.58.157-.15.357-.26.576-.3.218-.05.444-.03.65.06.205.09.381.23.504.41.124.19.19.41.19.63 0 .3-.119.58-.33.79-.21.22-.497.33-.795.33" /></Svg>;
export { SolidDot as ReactComponent };
