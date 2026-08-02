import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBrowsers = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H6.75c-.398 0-.78.16-1.06.44-.282.28-.44.66-.44 1.06v1.5h-1.5c-.398 0-.78.16-1.06.44-.282.28-.44.66-.44 1.06v10.5a1.506 1.506 0 0 0 1.5 1.5h13.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-1.5h1.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-3 4.5v1.5H3.75v-1.5zm3 7.5h-1.5v-7.5c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44H6.75v-1.5h13.5z" /></Svg>;
export { SolidBrowsers as ReactComponent };
export { SolidBrowsers };
export default SolidBrowsers;
