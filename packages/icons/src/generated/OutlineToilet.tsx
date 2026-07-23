import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineToilet = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M11.25 5.625a.75.75 0 0 1-.75.75H9a.75.75 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75m4.91 12.48.32 2.31c.04.21.02.43-.04.64-.06.2-.17.39-.31.56a1.48 1.48 0 0 1-1.13.51H9a1.47 1.47 0 0 1-1.13-.51c-.14-.17-.25-.36-.31-.56-.06-.21-.08-.43-.04-.64l.33-2.31a8.95 8.95 0 0 1-3.54-3.31A8.95 8.95 0 0 1 3 10.125a.75.75 0 0 1 .75-.75h1.5v-6a1.5 1.5 0 0 1 1.5-1.5h10.5a1.5 1.5 0 0 1 1.5 1.5v6h1.5a.75.75 0 0 1 .75.75c0 1.65-.45 3.26-1.31 4.67a9 9 0 0 1-3.53 3.31m-9.41-8.73h10.5v-6H6.75zm7.98 9.33c-1.78.56-3.68.56-5.46 0L9 20.625h6zm4.73-7.83H4.54a7.5 7.5 0 0 0 2.43 4.82 7.53 7.53 0 0 0 5.03 1.93c1.86 0 3.65-.69 5.03-1.93a7.5 7.5 0 0 0 2.43-4.82" /></Svg>;
export { OutlineToilet as ReactComponent };
