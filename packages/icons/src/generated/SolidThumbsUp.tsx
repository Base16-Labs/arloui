import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidThumbsUp = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.938 8.635a2.275 2.275 0 0 0-1.688-.76H15v-1.5a3.75 3.75 0 0 0-3.75-3.75.8.8 0 0 0-.395.11.8.8 0 0 0-.276.31l-3.542 7.08H3c-.398 0-.78.16-1.061.44s-.44.66-.44 1.06v8.25c0 .4.159.78.44 1.06s.663.44 1.06.44h16.126c.548 0 1.078-.2 1.489-.56.41-.36.676-.86.744-1.41l1.125-9a2.25 2.25 0 0 0-.545-1.77M3 11.625h3.75v8.25H3z" /></Svg>;
export { SolidThumbsUp as ReactComponent };
export { SolidThumbsUp };
export default SolidThumbsUp;
