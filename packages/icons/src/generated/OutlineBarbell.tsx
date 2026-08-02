import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBarbell = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M23.25 11.25h-.75v-3a1.506 1.506 0 0 0-1.5-1.5h-1.5V6A1.506 1.506 0 0 0 18 4.5h-2.25a1.506 1.506 0 0 0-1.5 1.5v5.25h-4.5V6a1.506 1.506 0 0 0-1.5-1.5H6A1.506 1.506 0 0 0 4.5 6v.75H3a1.506 1.506 0 0 0-1.5 1.5v3H.75A.755.755 0 0 0 0 12a.748.748 0 0 0 .75.75h.75v3c0 .398.16.78.44 1.061s.66.439 1.06.439h1.5V18c0 .398.16.78.44 1.061S5.6 19.5 6 19.5h2.25c.4 0 .78-.158 1.06-.439s.44-.663.44-1.061v-5.25h4.5V18c0 .398.16.78.44 1.061s.66.439 1.06.439H18c.4 0 .78-.158 1.06-.439s.44-.663.44-1.061v-.75H21c.4 0 .78-.158 1.06-.439s.44-.663.44-1.061v-3h.75a.748.748 0 0 0 .53-1.28.75.75 0 0 0-.53-.22M3 15.75v-7.5h1.5v7.5zM8.25 18H6V6h2.25zM18 18h-2.25V6H18v12m3-2.25h-1.5v-7.5H21z" /></Svg>;
export { OutlineBarbell as ReactComponent };
export { OutlineBarbell };
export default OutlineBarbell;
