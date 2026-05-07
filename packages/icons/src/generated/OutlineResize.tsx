import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineResize = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12.75 10.5H4.5a.75.75 0 0 0-.75.75v8.25a.75.75 0 0 0 .75.75h8.25a.75.75 0 0 0 .75-.75v-8.25a.75.75 0 0 0-.75-.75M12 18.75H5.25V12H12zm8.25-1.5v1.5a1.5 1.5 0 0 1-1.5 1.5H16.5a.75.75 0 0 1 0-1.5h2.25v-1.5a.75.75 0 0 1 1.5 0m0-6.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 1.5 0m0-5.25v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5a1.5 1.5 0 0 1 1.5 1.5m-6-.75a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75m-10.5 3V5.25a1.5 1.5 0 0 1 1.5-1.5h1.5a.75.75 0 0 1 0 1.5h-1.5V7.5a.75.75 0 0 1-1.5 0" /></Svg>;
export { OutlineResize as ReactComponent };
