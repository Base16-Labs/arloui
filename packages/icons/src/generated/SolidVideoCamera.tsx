import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidVideoCamera = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M17.25 6.75v10.5a1.5 1.5 0 0 1-1.5 1.5H2.25a1.5 1.5 0 0 1-1.5-1.5V6.75a1.5 1.5 0 0 1 1.5-1.5h13.5a1.5 1.5 0 0 1 1.5 1.5m5.44.02a.9.9 0 0 0-.33-.01c-.1.02-.2.06-.29.13l-3.15 2.1c-.05.03-.1.08-.13.13-.02.06-.04.12-.04.18v5.4c0 .06.02.12.04.18.03.05.08.1.13.13l3.16 2.11c.12.08.26.13.4.13.15 0 .29-.04.41-.11.11-.07.2-.17.27-.29.06-.12.09-.25.09-.38V7.5c0-.17-.06-.33-.16-.46a.74.74 0 0 0-.4-.27" /></Svg>;
export { SolidVideoCamera as ReactComponent };
export { SolidVideoCamera };
export default SolidVideoCamera;
