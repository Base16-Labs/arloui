import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineHourglass = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.75 7.09V3.75c0-.4-.16-.78-.44-1.06-.28-.29-.67-.44-1.06-.44H6.75c-.4 0-.78.15-1.06.44-.29.28-.44.66-.44 1.06v3.37c0 .23.05.46.15.67.11.21.26.39.45.53l4.9 3.68-4.9 3.67c-.19.14-.34.32-.45.53-.1.21-.15.44-.15.67v3.38c0 .39.15.78.44 1.06.28.28.66.44 1.06.44h10.5c.39 0 .78-.16 1.06-.44s.44-.67.44-1.06V16.9c0-.23-.06-.46-.16-.66-.11-.21-.26-.39-.44-.53L13.24 12l4.91-3.72a1.5 1.5 0 0 0 .6-1.19m-1.5 13.16H6.75v-3.38L12 12.93l5.25 3.97zm0-13.16L12 11.06 6.75 7.12V3.75h10.5z" /></Svg>;
export { OutlineHourglass as ReactComponent };
