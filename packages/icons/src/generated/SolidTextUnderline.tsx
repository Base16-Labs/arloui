import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTextUnderline = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3m-12 3.75a.75.75 0 0 1 1.5 0v4.5c0 .8.32 1.56.88 2.12.56.57 1.33.88 2.12.88.8 0 1.56-.31 2.12-.88.57-.56.88-1.32.88-2.12v-4.5a.75.75 0 0 1 1.5 0v4.5c0 1.2-.47 2.34-1.32 3.18-.84.85-1.98 1.32-3.18 1.32-1.19 0-2.34-.47-3.18-1.32a4.5 4.5 0 0 1-1.32-3.18zm9 12h-9a.75.75 0 0 1 0-1.5h9a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidTextUnderline as ReactComponent };
