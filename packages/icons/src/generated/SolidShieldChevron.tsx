import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidShieldChevron = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 2.625h-15a1.5 1.5 0 0 0-1.5 1.5v5.25c0 4.94 2.39 7.94 4.4 9.58 2.16 1.77 4.31 2.37 4.41 2.39.12.04.26.04.39 0 .09-.02 2.24-.62 4.41-2.39 2-1.64 4.39-4.64 4.39-9.58v-5.25a1.5 1.5 0 0 0-1.5-1.5m0 6.75c0 1.65-.29 3.14-.86 4.49l-6.21-4.35a.76.76 0 0 0-.43-.14c-.15 0-.3.05-.43.14l-6.21 4.35c-.57-1.35-.86-2.84-.86-4.49v-5.25h15z" /></Svg>;
export { SolidShieldChevron as ReactComponent };
