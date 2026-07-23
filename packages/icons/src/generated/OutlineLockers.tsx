import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineLockers = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18 6.375a.75.75 0 0 1-.75.75H15a.75.75 0 0 1 0-1.5h2.25a.75.75 0 0 1 .75.75m-.75 2.25H15a.75.75 0 0 0 0 1.5h2.25a.75.75 0 0 0 0-1.5m-10.5-1.5H9a.75.75 0 0 0 0-1.5H6.75a.75.75 0 0 0 0 1.5M9 8.625H6.75a.75.75 0 0 0 0 1.5H9a.75.75 0 0 0 0-1.5m12-4.5v16.5a.75.75 0 1 1-1.5 0v-1.5h-6.75v1.5a.75.75 0 1 1-1.5 0v-1.5H4.5v1.5a.75.75 0 1 1-1.5 0v-16.5c0-.4.16-.78.44-1.06.28-.29.66-.44 1.06-.44h15c.4 0 .78.15 1.06.44.28.28.44.66.44 1.06m-9.75 13.5v-13.5H4.5v13.5zm1.5 0h6.75v-13.5h-6.75z" /></Svg>;
export { OutlineLockers as ReactComponent };
