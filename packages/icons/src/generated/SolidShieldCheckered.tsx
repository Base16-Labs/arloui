import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidShieldCheckered = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 2.625h-15a1.5 1.5 0 0 0-1.5 1.5v5.25c0 4.94 2.39 7.94 4.4 9.58 2.16 1.77 4.31 2.37 4.41 2.39.12.04.26.04.39 0 .09-.02 2.24-.62 4.41-2.39 2-1.64 4.39-4.64 4.39-9.58v-5.25a1.5 1.5 0 0 0-1.5-1.5M12 19.845c-1.33-.47-2.56-1.16-3.65-2.05-2.18-1.78-3.44-4.11-3.77-6.92H12v-6.75h7.5v5.25c0 .5-.03 1-.08 1.5H12z" /></Svg>;
export { SolidShieldCheckered as ReactComponent };
