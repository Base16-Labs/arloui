import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCalendarBlank = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3.75h-2.25V3a.753.753 0 0 0-1.28-.53c-.141.14-.22.33-.22.53v.75h-7.5V3a.753.753 0 0 0-1.28-.53c-.141.14-.22.33-.22.53v.75H4.5c-.398 0-.78.16-1.06.44-.282.28-.44.66-.44 1.06v15a1.506 1.506 0 0 0 1.5 1.5h15c.398 0 .78-.16 1.06-.44.282-.28.44-.66.44-1.06v-15a1.506 1.506 0 0 0-1.5-1.5M6.75 5.25V6a.753.753 0 0 0 1.28.53c.141-.14.22-.33.22-.53v-.75h7.5V6a.753.753 0 0 0 1.28.53c.141-.14.22-.33.22-.53v-.75h2.25v3h-15v-3zm12.75 15h-15V9.75h15z" /></Svg>;
export { OutlineCalendarBlank as ReactComponent };
