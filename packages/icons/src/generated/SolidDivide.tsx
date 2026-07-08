import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDivide = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3M12 6a1.5 1.5 0 0 1 1.39.93c.11.27.14.57.08.86s-.2.56-.41.77-.48.35-.77.41-.59.03-.86-.08A1.5 1.5 0 0 1 12 6m0 12c-.3 0-.59-.09-.83-.25-.25-.17-.44-.4-.55-.68a1.4 1.4 0 0 1-.09-.86c.06-.29.2-.56.41-.77s.48-.35.77-.41.59-.03.86.08A1.5 1.5 0 0 1 12 18m5.25-5.25H6.75a.75.75 0 0 1 0-1.5h10.5a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidDivide as ReactComponent };
