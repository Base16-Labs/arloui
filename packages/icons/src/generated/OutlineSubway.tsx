import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSubway = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 9.75v10.5a.751.751 0 0 1-1.5 0V9.75a5.25 5.25 0 0 0-1.539-3.71A5.27 5.27 0 0 0 14.25 4.5h-4.5a5.27 5.27 0 0 0-3.711 1.54A5.25 5.25 0 0 0 4.5 9.75v10.5a.751.751 0 0 1-1.5 0V9.75c.002-1.79.714-3.5 1.979-4.77A6.77 6.77 0 0 1 9.75 3h4.5c1.79 0 3.505.72 4.771 1.98A6.77 6.77 0 0 1 21 9.75m-3.75 0v6.75a2.254 2.254 0 0 1-1.808 2.21l.229.46a.738.738 0 0 1-.104.82.63.63 0 0 1-.231.18.7.7 0 0 1-.573.04.8.8 0 0 1-.255-.14.8.8 0 0 1-.179-.23l-.542-1.09h-3.574l-.542 1.09a.76.76 0 0 1-.434.37.72.72 0 0 1-.573-.04.74.74 0 0 1-.335-1l.229-.46A2.254 2.254 0 0 1 6.75 16.5V9.75c0-.6.237-1.17.659-1.59S8.403 7.5 9 7.5h6c.597 0 1.169.24 1.591.66s.659.99.659 1.59m-9 0v4.5h7.5v-4.5A.751.751 0 0 0 15 9H9a.75.75 0 0 0-.75.75m3 6v1.5h1.5v-1.5zM9 17.25h.75v-1.5h-1.5v.75a.751.751 0 0 0 .75.75m6.75-.75v-.75h-1.5v1.5H15a.75.75 0 0 0 .75-.75" /></Svg>;
export { OutlineSubway as ReactComponent };
export { OutlineSubway };
export default OutlineSubway;
