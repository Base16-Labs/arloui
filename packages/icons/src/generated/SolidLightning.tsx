import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidLightning = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.052 11.767-10.5 11.25c-.11.12-.26.2-.42.22-.16.03-.33.01-.47-.07a.73.73 0 0 1-.33-.34.7.7 0 0 1-.06-.47l1.37-6.87-5.4-2.03a.8.8 0 0 1-.3-.21.65.65 0 0 1-.17-.33.63.63 0 0 1 .01-.36c.03-.12.09-.23.18-.32l10.5-11.25c.11-.12.25-.2.41-.23.16-.02.33 0 .47.07.15.08.27.2.34.34.07.15.09.32.06.48l-1.38 6.88 5.4 2.02q.18.075.3.21a.732.732 0 0 1 .16.69c-.03.12-.09.23-.18.32z" /></Svg>;
export { SolidLightning as ReactComponent };
export { SolidLightning };
export default SolidLightning;
