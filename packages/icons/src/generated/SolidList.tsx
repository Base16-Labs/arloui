import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidList = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.4 0-.78.15-1.06.44C3.16 3.72 3 4.1 3 4.5v15A1.499 1.499 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44M18 17.25H6a.75.75 0 0 1 0-1.5h12a.75.75 0 0 1 0 1.5m0-4.5H6a.75.75 0 0 1 0-1.5h12a.75.75 0 0 1 0 1.5m0-4.5H6a.75.75 0 0 1 0-1.5h12a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidList as ReactComponent };
