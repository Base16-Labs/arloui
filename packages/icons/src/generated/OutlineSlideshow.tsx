import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSlideshow = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18 4.5H6c-.398 0-.779.16-1.061.44S4.5 5.6 4.5 6v12c0 .4.158.78.439 1.06s.663.44 1.061.44h12c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V6c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 18 4.5M18 18H6V6h12zm4.5-12.75v13.5a.751.751 0 0 1-1.5 0V5.25a.751.751 0 0 1 1.5 0M3 5.25v13.5a.751.751 0 0 1-1.5 0V5.25a.751.751 0 0 1 1.5 0" /></Svg>;
export { OutlineSlideshow as ReactComponent };
export { OutlineSlideshow };
export default OutlineSlideshow;
