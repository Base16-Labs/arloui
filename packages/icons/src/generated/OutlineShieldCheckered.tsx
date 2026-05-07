import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineShieldCheckered = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 2.625h-15a1.5 1.5 0 0 0-1.5 1.5v5.25c0 4.94 2.39 7.94 4.4 9.58 2.16 1.77 4.31 2.37 4.41 2.39.12.04.26.04.39 0 .09-.02 2.24-.62 4.41-2.39 2-1.64 4.39-4.64 4.39-9.58v-5.25a1.5 1.5 0 0 0-1.5-1.5m0 1.5v5.25c0 .26-.01.5-.02.75h-6.73v-6zm-15 0h6.75v6H4.52c-.01-.25-.02-.49-.02-.75zm.19 7.5h6.56v7.93c-1.04-.45-2.02-1.04-2.9-1.76-1.98-1.62-3.21-3.69-3.65-6.17zm11 6.13c-.89.74-1.88 1.34-2.94 1.8v-7.93h6.55c-.44 2.46-1.65 4.52-3.61 6.13" /></Svg>;
export { OutlineShieldCheckered as ReactComponent };
