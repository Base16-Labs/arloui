import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDesk = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M23.25 5.625H.75a.751.751 0 0 0 0 1.5h.75v10.5a.751.751 0 0 0 1.5 0v-4.5h18v4.5a.751.751 0 0 0 1.5 0v-10.5h.75a.751.751 0 0 0 0-1.5m-15.75 4.5H5.25a.751.751 0 0 1 0-1.5H7.5a.751.751 0 0 1 0 1.5m5.25.75a.751.751 0 0 1-1.5 0v-3a.751.751 0 0 1 1.5 0zm6-.75H16.5a.751.751 0 0 1 0-1.5h2.25a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidDesk as ReactComponent };
export { SolidDesk };
export default SolidDesk;
