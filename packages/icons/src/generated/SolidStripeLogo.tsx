import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidStripeLogo = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3M12 17.25c-2.07 0-3.75-1.34-3.75-3a.75.75 0 0 1 1.5 0c0 .81 1.03 1.5 2.25 1.5s2.25-.69 2.25-1.5c0-.89-.81-1.22-2.52-1.71-1.48-.43-3.31-.96-3.31-2.79 0-1.71 1.54-3 3.58-3 1.47 0 2.74.69 3.29 1.78a.75.75 0 0 1 .06.58c-.03.1-.08.19-.14.27a.8.8 0 0 1-.24.18c-.09.05-.18.07-.29.08-.1.01-.2-.01-.29-.04a.7.7 0 0 1-.26-.15q-.105-.105-.18-.24c-.3-.59-1.05-.96-1.95-.96-1.19 0-2.08.65-2.08 1.5 0 .66.84.95 2.23 1.35 1.52.43 3.6 1.04 3.6 3.15 0 1.66-1.68 3-3.75 3" /></Svg>;
export { SolidStripeLogo as ReactComponent };
export { SolidStripeLogo };
export default SolidStripeLogo;
