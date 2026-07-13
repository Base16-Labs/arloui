import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCrane = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.761 2.735a.8.8 0 0 0-.367-.11.8.8 0 0 0-.371.09L9.937 8.625H3.375c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v9.75c0 .4.158.78.439 1.06s.663.44 1.061.44h8.25c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-3q0-.105-.032-.21l-2.074-6.91 9.606-5.13v11.5h-1.5v-.75a.751.751 0 0 0-1.5 0v.75c0 .4.158.78.439 1.06s.663.44 1.061.44h1.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V3.375c0-.13-.033-.25-.097-.37a.8.8 0 0 0-.267-.27m-12.194 7.39 1.8 6H6.375v-6zm-4.692 0v6h-1.5v-6zm-1.5 9.75v-2.25h8.25v2.25z" /></Svg>;
export { OutlineCrane as ReactComponent };
