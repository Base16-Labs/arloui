import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMemberOf = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.4 0-.78.15-1.06.44C3.16 3.72 3 4.1 3 4.5v15A1.499 1.499 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44m-3 8.25a.75.75 0 0 1 0 1.5H7.56A4.532 4.532 0 0 0 12 16.5h4.5a.75.75 0 0 1 0 1.5H12a6.01 6.01 0 0 1-6-6 5.993 5.993 0 0 1 6-6h4.5a.75.75 0 0 1 0 1.5H12c-1.06 0-2.09.37-2.9 1.06a4.55 4.55 0 0 0-1.54 2.69z" /></Svg>;
export { SolidMemberOf as ReactComponent };
