import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSeat = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.625 21.748a.75.75 0 0 1-.75.75h-9.75a.75.75 0 0 1 0-1.5h9.75a.75.75 0 0 1 .75.75m-1.5-8.25h-6.02l-2.98-6 1.33-2.47c.01 0 .01-.01.01-.02.18-.35.21-.76.08-1.14-.12-.38-.39-.69-.75-.87l-.04-.02-3.16-1.33c-.35-.17-.76-.19-1.13-.07-.37.13-.68.4-.86.75l-2.07 4.13c-.1.2-.16.43-.16.67 0 .23.06.46.16.67l5.45 10.87a1.47 1.47 0 0 0 1.34.83h8.8a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5" /></Svg>;
export { SolidSeat as ReactComponent };
