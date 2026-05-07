import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPushPin = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m21.31 10.5-5.01 5.03c.43 1.19.6 3.17-1.24 5.62-.13.17-.29.32-.48.42s-.4.16-.61.18h-.11c-.19 0-.39-.04-.57-.12-.18-.07-.35-.18-.49-.32l-4.52-4.53-4 4a.75.75 0 1 1-1.06-1.06l4-4-4.53-4.53c-.15-.15-.26-.32-.34-.52-.07-.2-.11-.41-.1-.62a1.6 1.6 0 0 1 .56-1.09C5.2 7.04 7.48 7.42 8.48 7.73l5.02-5.04c.14-.14.3-.25.49-.33.18-.07.37-.11.57-.11s.39.04.57.11c.19.08.35.19.49.33l5.69 5.69a1.5 1.5 0 0 1 0 2.12" /></Svg>;
export { SolidPushPin as ReactComponent };
