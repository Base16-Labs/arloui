import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCrop = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 18a.751.751 0 0 1-.75.75h-3v3a.751.751 0 0 1-1.5 0v-3H6a.75.75 0 0 1-.75-.75V6.75h-3a.751.751 0 0 1 0-1.5h3v-3a.751.751 0 0 1 1.5 0v15h15a.75.75 0 0 1 .75.75M9 6.75h8.25V15a.751.751 0 0 0 1.5 0V6a.751.751 0 0 0-.75-.75H9a.751.751 0 0 0 0 1.5" /></Svg>;
export { SolidCrop as ReactComponent };
