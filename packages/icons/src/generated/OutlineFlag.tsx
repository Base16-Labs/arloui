import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFlag = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M3.26 4.315a.76.76 0 0 0-.26.56v15.75a.75.75 0 0 0 1.5 0v-4.14c2.51-1.99 4.67-.92 7.17.31 1.53.77 3.19 1.58 4.96 1.58 1.31 0 2.68-.44 4.11-1.68a.7.7 0 0 0 .19-.26c.05-.09.07-.2.07-.31V4.875c0-.14-.04-.28-.12-.4a.8.8 0 0 0-.32-.28.76.76 0 0 0-.42-.06c-.14.02-.27.08-.38.18-2.63 2.27-4.85 1.17-7.43-.11-2.67-1.32-5.7-2.82-9.07.11m16.24 11.46c-2.51 1.98-4.68.91-7.17-.32-2.34-1.16-4.95-2.45-7.83-.79v-9.43c2.51-1.99 4.67-.92 7.17.32 2.34 1.15 4.95 2.45 7.83.78z" /></Svg>;
export { OutlineFlag as ReactComponent };
export { OutlineFlag };
export default OutlineFlag;
