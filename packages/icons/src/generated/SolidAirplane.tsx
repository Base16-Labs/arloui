import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidAirplane = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 12.75v3a.75.75 0 0 1-.897.734l-6.978-1.39v2.224l1.656 1.654c.139.14.218.33.219.527v2.25a.753.753 0 0 1-1.031.697L12 21.057l-3.469 1.389a.748.748 0 0 1-1.031-.697V19.5a.75.75 0 0 1 .219-.53l1.656-1.655v-2.22l-6.978 1.39a.748.748 0 0 1-.897-.735v-3a.75.75 0 0 1 .414-.67l7.461-3.73V4.124a2.626 2.626 0 0 1 4.481-1.856c.492.493.769 1.16.769 1.856V8.35l7.461 3.73a.75.75 0 0 1 .414.67" /></Svg>;
export { SolidAirplane as ReactComponent };
export { SolidAirplane };
export default SolidAirplane;
