import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCoffee = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M6.75 6V3a.751.751 0 0 1 1.5 0v3a.751.751 0 0 1-1.5 0m3.75.75a.75.75 0 0 0 .75-.75V3a.751.751 0 0 0-1.5 0v3a.751.751 0 0 0 .75.75m3 0a.75.75 0 0 0 .75-.75V3a.751.751 0 0 0-1.5 0v3a.751.751 0 0 0 .75.75m9 5.25v.75c0 .96-.364 1.87-1.017 2.57a3.77 3.77 0 0 1-2.5 1.17 9.05 9.05 0 0 1-2.531 3.76h2.298a.751.751 0 0 1 0 1.5H2.25a.751.751 0 0 1 0-1.5h2.301a8.9 8.9 0 0 1-2.25-3.05 9 9 0 0 1-.801-3.7V9a.751.751 0 0 1 .75-.75h16.5A3.75 3.75 0 0 1 22.5 12M18 9.75H3v3.75a7.5 7.5 0 0 0 1.149 3.98 7.43 7.43 0 0 0 3.081 2.77h6.54a7.43 7.43 0 0 0 3.081-2.77A7.5 7.5 0 0 0 18 13.5zM21 12c0-.46-.144-.92-.413-1.3a2.28 2.28 0 0 0-1.087-.82v3.62q-.001.705-.112 1.41c.465-.14.873-.42 1.164-.81s.448-.86.448-1.35z" /></Svg>;
export { OutlineCoffee as ReactComponent };
export { OutlineCoffee };
export default OutlineCoffee;
