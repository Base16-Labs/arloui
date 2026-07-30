import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFaders = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12.75 11.25v9a.75.75 0 0 1-1.5 0v-9a.75.75 0 0 1 1.5 0m6 6.75a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 1.5 0v-1.5a.75.75 0 0 0-.75-.75M21 13.5h-1.5V3.75a.75.75 0 0 0-1.5 0v9.75h-1.5a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75H21a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75M5.25 15a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75m2.25-4.5H6V3.75a.75.75 0 0 0-1.5 0v6.75H3a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75M14.25 6h-1.5V3.75a.75.75 0 0 0-1.5 0V6h-1.5a.75.75 0 0 0-.75.75v1.5a.75.75 0 0 0 .75.75h4.5a.75.75 0 0 0 .75-.75v-1.5a.75.75 0 0 0-.75-.75" /></Svg>;
export { SolidFaders as ReactComponent };
