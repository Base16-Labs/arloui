import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidStamp = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 21.375a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1 0-1.5h16.5a.75.75 0 0 1 .75.75m-1.5-9h-5.29l1.47-6.87a2.94 2.94 0 0 0-.6-2.51c-.28-.35-.63-.63-1.04-.83-.4-.19-.84-.29-1.29-.29h-1.5c-.45 0-.89.1-1.29.29-.41.2-.76.48-1.04.83a2.94 2.94 0 0 0-.6 2.51l1.47 6.87H4.5a1.5 1.5 0 0 0-1.5 1.5v3.75a1.5 1.5 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-3.75a1.5 1.5 0 0 0-1.5-1.5" /></Svg>;
export { SolidStamp as ReactComponent };
export { SolidStamp };
export default SolidStamp;
