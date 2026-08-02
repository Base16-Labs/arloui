import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidQuotes = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M10.88 6.375v8.25a4.56 4.56 0 0 1-1.32 3.18 4.53 4.53 0 0 1-3.18 1.32.8.8 0 0 1-.54-.22.75.75 0 0 1 0-1.06.8.8 0 0 1 .54-.22c.79 0 1.55-.32 2.12-.88.56-.56.88-1.33.88-2.12v-.75H3.75a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h5.63c.39 0 .77.16 1.06.44.28.28.44.66.44 1.06m9.37-1.5h-5.63c-.39 0-.77.16-1.06.44-.28.28-.44.66-.44 1.06v6c0 .4.16.78.44 1.06.29.28.67.44 1.06.44h5.63v.75c0 .79-.32 1.56-.88 2.12s-1.32.88-2.12.88a.75.75 0 0 0 0 1.5c1.19 0 2.34-.48 3.18-1.32s1.32-1.99 1.32-3.18v-8.25a1.5 1.5 0 0 0-1.5-1.5" /></Svg>;
export { SolidQuotes as ReactComponent };
export { SolidQuotes };
export default SolidQuotes;
