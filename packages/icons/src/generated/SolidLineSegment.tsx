import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidLineSegment = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.86 7.855c-.4.4-.92.66-1.48.74a2.64 2.64 0 0 1-1.63-.29l-8.44 8.45a2.62 2.62 0 0 1-.16 2.75c-.28.4-.66.71-1.11.91-.45.19-.94.25-1.42.18a2.7 2.7 0 0 1-1.31-.58c-.37-.31-.65-.72-.8-1.19-.16-.46-.18-.95-.07-1.43.12-.47.36-.91.7-1.25.4-.4.92-.66 1.48-.74s1.13.02 1.63.29l8.44-8.45c-.23-.42-.34-.91-.31-1.39.03-.49.19-.96.47-1.36s.66-.71 1.11-.9c.45-.2.94-.26 1.42-.19s.93.27 1.31.58c.37.32.65.73.8 1.19.16.46.18.96.07 1.43-.12.47-.36.91-.7 1.25" /></Svg>;
export { SolidLineSegment as ReactComponent };
