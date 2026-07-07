import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBoundingBox = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 9A1.5 1.5 0 0 0 21 7.5v-3A1.5 1.5 0 0 0 19.5 3h-3A1.5 1.5 0 0 0 15 4.5v.75H9V4.5A1.5 1.5 0 0 0 7.5 3h-3A1.5 1.5 0 0 0 3 4.5v3A1.5 1.5 0 0 0 4.5 9h.75v6H4.5A1.5 1.5 0 0 0 3 16.5v3A1.5 1.5 0 0 0 4.5 21h3A1.5 1.5 0 0 0 9 19.5v-.75h6v.75a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-1.5-1.5h-.75V9zm-2.25 6h-.75a1.5 1.5 0 0 0-1.5 1.5v.75H9v-.75A1.5 1.5 0 0 0 7.5 15h-.75V9h.75A1.5 1.5 0 0 0 9 7.5v-.75h6v.75A1.5 1.5 0 0 0 16.5 9h.75z" /></Svg>;
export { SolidBoundingBox as ReactComponent };
