import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMapPinSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12.745 11.94v9.81c0 .2-.07.39-.22.53a.75.75 0 0 1-1.28-.53v-9.81c-1.31-.19-2.5-.87-3.33-1.9a5.2 5.2 0 0 1-1.15-3.67c.09-1.32.69-2.56 1.66-3.47a5.263 5.263 0 0 1 7.15 0c.97.91 1.57 2.15 1.66 3.47.1 1.32-.31 2.63-1.15 3.67a5.24 5.24 0 0 1-3.34 1.9" /></Svg>;
export { SolidMapPinSimple as ReactComponent };
export { SolidMapPinSimple };
export default SolidMapPinSimple;
