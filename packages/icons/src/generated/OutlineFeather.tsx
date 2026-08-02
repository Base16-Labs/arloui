import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFeather = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.369 3.635a6.02 6.02 0 0 0-4.242-1.76c-1.59 0-3.117.64-4.242 1.76l-6.572 6.49c-.14.14-.25.31-.326.49-.075.18-.114.38-.113.57v6.88l-2.78 2.78a.75.75 0 0 0-.22.53c0 .1.019.2.056.29a.754.754 0 0 0 .693.46c.1 0 .197-.02.288-.05.09-.04.174-.1.243-.17l2.781-2.78h6.88c.196 0 .391-.04.573-.11.182-.08.347-.19.486-.33l6.49-6.56a6.03 6.03 0 0 0 1.763-4.24 6 6 0 0 0-1.758-4.25m-7.426 1.06a4.5 4.5 0 0 1 3.12-1.32 4.55 4.55 0 0 1 3.155 1.23 4.5 4.5 0 0 1 .261 6.27h-5.293l3.22-3.22a.746.746 0 0 0 0-1.06.754.754 0 0 0-1.061 0l-5.471 5.47v-5.33zm-6.57 6.5 3-2.97v5.34l-3 3zm6.441 6.43H7.435l5.25-5.25h5.32z" /></Svg>;
export { OutlineFeather as ReactComponent };
export { OutlineFeather };
export default OutlineFeather;
