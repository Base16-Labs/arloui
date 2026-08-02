import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBatteryEmpty = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.375 5.25H2.625A2.25 2.25 0 0 0 .375 7.5v9a2.25 2.25 0 0 0 2.25 2.25h15.75c.597 0 1.169-.237 1.59-.659.42-.422.66-.994.66-1.591v-9a2.26 2.26 0 0 0-.66-1.591 2.25 2.25 0 0 0-1.59-.659m.75 11.25a.75.75 0 0 1-.75.75H2.625a.75.75 0 0 1-.75-.75v-9a.75.75 0 0 1 .75-.75h15.75a.749.749 0 0 1 .75.75zm4.5-7.5v6a.748.748 0 0 1-1.28.531.76.76 0 0 1-.22-.531V9a.753.753 0 0 1 .75-.75.753.753 0 0 1 .75.75" /></Svg>;
export { OutlineBatteryEmpty as ReactComponent };
export { OutlineBatteryEmpty };
export default OutlineBatteryEmpty;
