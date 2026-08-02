import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFlag = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 4.873v11.25c0 .11-.03.21-.07.31a.8.8 0 0 1-.19.25c-1.44 1.24-2.81 1.69-4.11 1.69-1.77 0-3.43-.82-4.97-1.58-2.49-1.23-4.65-2.3-7.16-.31v4.14a.75.75 0 0 1-1.28.53.7.7 0 0 1-.22-.53V4.872c0-.1.02-.21.06-.31a.8.8 0 0 1 .2-.25c3.37-2.92 6.4-1.43 9.07-.11 2.57 1.28 4.8 2.38 7.42.11.11-.09.25-.16.39-.18q.21-.03.42.06c.13.06.24.16.32.28.07.12.12.26.12.4" /></Svg>;
export { SolidFlag as ReactComponent };
export { SolidFlag };
export default SolidFlag;
