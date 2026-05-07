import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidLockSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 8.625h-3v-2.25c0-1.2-.47-2.34-1.32-3.19A4.5 4.5 0 0 0 12 1.875c-1.19 0-2.34.47-3.18 1.31-.85.85-1.32 1.99-1.32 3.19v2.25h-3c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v10.5a1.499 1.499 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-10.5c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44M9 6.375c0-.8.32-1.56.88-2.13.56-.56 1.32-.87 2.12-.87s1.56.31 2.12.87c.56.57.88 1.33.88 2.13v2.25H9z" /></Svg>;
export { SolidLockSimple as ReactComponent };
