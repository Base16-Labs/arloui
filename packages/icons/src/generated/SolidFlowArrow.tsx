import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFlowArrow = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m22.655 8.404-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72h-1.19c-3.63 0-4.37 1.78-5.31 4.04-.97 2.32-2.07 4.96-6.69 4.96h-.09c-.19.71-.62 1.32-1.22 1.73-.61.41-1.34.59-2.07.5-.72-.1-1.39-.45-1.87-1-.48-.54-.75-1.25-.75-1.98s.27-1.43.75-1.98 1.15-.9 1.87-1c.73-.09 1.46.09 2.07.5.6.41 1.03 1.02 1.22 1.73h.09c3.63 0 4.37-1.78 5.31-4.04.97-2.32 2.07-4.96 6.69-4.96h1.19l-1.72-1.72a.75.75 0 1 1 1.06-1.06l3 3c.07.07.13.15.16.24a.72.72 0 0 1 0 .58c-.03.09-.09.17-.16.24" /></Svg>;
export { SolidFlowArrow as ReactComponent };
