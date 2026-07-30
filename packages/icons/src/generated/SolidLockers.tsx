import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidLockers = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 2.625h-15c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v16.5a.75.75 0 1 0 1.5 0v-1.5h6.75v1.5a.75.75 0 1 0 1.5 0v-1.5h6.75v1.5a.75.75 0 1 0 1.5 0v-16.5c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44M9 10.125H5.25a.75.75 0 0 1 0-1.5H9a.75.75 0 0 1 0 1.5m0-3H5.25a.75.75 0 0 1 0-1.5H9a.75.75 0 0 1 0 1.5m3.75 9.75a.75.75 0 1 1-1.5 0v-12a.75.75 0 0 1 1.5 0zm6-6.75H15a.75.75 0 0 1 0-1.5h3.75a.75.75 0 0 1 0 1.5m0-3H15a.75.75 0 0 1 0-1.5h3.75a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidLockers as ReactComponent };
