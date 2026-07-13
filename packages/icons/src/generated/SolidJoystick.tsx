import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidJoystick = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 15.75v4.5a1.499 1.499 0 0 1-1.5 1.5h-15a1.5 1.5 0 0 1-1.5-1.5v-4.5c0-.4.16-.78.44-1.06.28-.29.66-.44 1.06-.44h6.75V9.67c-.91-.19-1.72-.7-2.27-1.45a3.78 3.78 0 0 1-.71-2.6c.1-.93.53-1.78 1.22-2.41.69-.62 1.58-.96 2.51-.96s1.83.34 2.52.96a3.74 3.74 0 0 1 1.21 2.41c.1.92-.16 1.85-.71 2.6s-1.36 1.26-2.27 1.45v4.58h6.75c.4 0 .78.15 1.06.44.28.28.44.66.44 1.06M15 12a.75.75 0 0 0 .75.75h3a.75.75 0 0 0 .53-1.28.7.7 0 0 0-.53-.22h-3c-.2 0-.39.07-.53.22A.75.75 0 0 0 15 12" /></Svg>;
export { SolidJoystick as ReactComponent };
