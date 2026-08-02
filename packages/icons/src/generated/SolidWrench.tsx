import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWrench = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.751 8.999a6.8 6.8 0 0 1-.812 3.22 6.85 6.85 0 0 1-2.244 2.44c-.94.61-2.018.98-3.136 1.07a6.7 6.7 0 0 1-3.271-.54l-4.881 5.64c-.011.02-.024.03-.037.04-.562.57-1.325.88-2.121.88s-1.559-.31-2.122-.88a2.99 2.99 0 0 1-.878-2.12c0-.79.316-1.56.878-2.12.013-.01.027-.03.041-.04l5.645-4.88a6.74 6.74 0 0 1-.495-3.68 6.8 6.8 0 0 1 1.527-3.39 6.7 6.7 0 0 1 3.087-2.06 6.8 6.8 0 0 1 3.713-.13c.126.03.242.1.336.19q.142.135.201.33a.756.756 0 0 1-.168.72l-3.513 3.81.53 2.47 2.47.53 3.811-3.52a.717.717 0 0 1 .723-.16c.125.03.238.1.328.2.09.09.154.21.185.33q.203.81.203 1.65" /></Svg>;
export { SolidWrench as ReactComponent };
export { SolidWrench };
export default SolidWrench;
