import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidHouseSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 11.625v9a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-9c0-.2.04-.4.11-.58.08-.18.19-.35.33-.49l7.5-7.5c.28-.28.66-.43 1.06-.43s.78.15 1.06.43l7.5 7.5c.14.14.25.31.33.49.07.18.11.38.11.58" /></Svg>;
export { SolidHouseSimple as ReactComponent };
