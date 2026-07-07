import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFaders = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12.75 11.25v9a.75.75 0 0 1-1.5 0v-9a.75.75 0 0 1 1.5 0m6 6.75a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.75.75 0 0 0-.75-.75M21 15h-1.5V3.75a.75.75 0 0 0-1.5 0V15h-1.5a.75.75 0 0 0 0 1.5H21a.75.75 0 0 0 0-1.5M5.25 15a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75m2.25-3H6V3.75a.75.75 0 0 0-1.5 0V12H3a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5m6.75-4.5h-1.5V3.75a.75.75 0 0 0-1.5 0V7.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5" /></Svg>;
export { OutlineFaders as ReactComponent };
