import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCalendarBlank = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3.75h-2.25V3a.751.751 0 0 0-1.5 0v.75h-7.5V3a.752.752 0 0 0-1.28-.53c-.141.14-.22.33-.22.53v.75H4.5c-.398 0-.78.16-1.06.44-.282.28-.44.66-.44 1.06v15a1.506 1.506 0 0 0 1.5 1.5h15c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-15c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m0 4.5h-15v-3h2.25V6a.753.753 0 0 0 1.28.53c.141-.14.22-.33.22-.53v-.75h7.5V6a.751.751 0 0 0 1.5 0v-.75h2.25z" /></Svg>;
export { SolidCalendarBlank as ReactComponent };
