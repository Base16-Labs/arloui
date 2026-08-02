import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChalkboard = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 18.375h-.75V5.625a1.5 1.5 0 0 0-1.5-1.5H3.75a1.5 1.5 0 0 0-1.5 1.5v12.75H1.5a.75.75 0 0 0 0 1.5h21a.75.75 0 0 0 0-1.5M3.75 5.625h16.5v12.75h-1.5v-2.25a.75.75 0 0 0-.75-.75h-6.75a.75.75 0 0 0-.75.75v2.25H6.75v-9.75h10.5v4.5a.75.75 0 0 0 1.5 0v-5.25a.75.75 0 0 0-.75-.75H6a.75.75 0 0 0-.75.75v10.5h-1.5zm13.5 12.75H12v-1.5h5.25z" /></Svg>;
export { OutlineChalkboard as ReactComponent };
export { OutlineChalkboard };
export default OutlineChalkboard;
