import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDevices = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.625 6.75h-1.5V6c0-.6-.237-1.17-.659-1.59a2.26 2.26 0 0 0-1.591-.66h-13.5a2.26 2.26 0 0 0-1.591.66c-.422.42-.659.99-.659 1.59v9c0 .6.237 1.17.659 1.59s.994.66 1.591.66h10.5V18c0 .6.237 1.17.659 1.59s.994.66 1.591.66h4.5c.597 0 1.169-.24 1.591-.66s.659-.99.659-1.59V9c0-.6-.237-1.17-.659-1.59a2.26 2.26 0 0 0-1.591-.66m.75 11.25a.751.751 0 0 1-.75.75h-4.5a.75.75 0 0 1-.75-.75V9a.751.751 0 0 1 .75-.75h4.5a.75.75 0 0 1 .75.75zm-9 1.5a.751.751 0 0 1-.75.75h-3.75a.753.753 0 0 1-.75-.75.753.753 0 0 1 .75-.75h3.75a.75.75 0 0 1 .75.75m7.5-9a.751.751 0 0 1-.75.75h-1.5a.751.751 0 0 1 0-1.5h1.5a.75.75 0 0 1 .75.75" /></Svg>;
export { SolidDevices as ReactComponent };
export { SolidDevices };
export default SolidDevices;
