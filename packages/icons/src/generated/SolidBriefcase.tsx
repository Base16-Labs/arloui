import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBriefcase = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M14.25 11.25a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75m7.5-3.75v12a1.5 1.5 0 0 1-1.5 1.5H3.75a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 3.75 6H7.5v-.75c0-.6.24-1.17.66-1.59.42-.43.99-.66 1.59-.66h4.5c.6 0 1.17.23 1.59.66.42.42.66.99.66 1.59V6h3.75a1.5 1.5 0 0 1 1.5 1.5M9 6h6v-.75a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0-.75.75zm11.25 5.4V7.5H3.75v3.9c2.53 1.38 5.37 2.1 8.25 2.1s5.72-.72 8.25-2.1" /></Svg>;
export { SolidBriefcase as ReactComponent };
