import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCompass = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.25c-1.93 0-3.81.57-5.42 1.65a9.77 9.77 0 0 0-3.59 4.37 9.7 9.7 0 0 0-.55 5.63c.37 1.9 1.3 3.63 2.67 5a9.7 9.7 0 0 0 4.99 2.66c1.89.38 3.85.19 5.63-.55a9.8 9.8 0 0 0 4.38-3.59 9.75 9.75 0 0 0-1.22-12.31A9.73 9.73 0 0 0 12 2.25m4.84 5.42-3 6c-.04.07-.1.13-.17.17l-6 3c-.07.03-.15.05-.23.03a.4.4 0 0 1-.21-.1.41.41 0 0 1-.07-.44l3-6c.04-.07.1-.13.17-.16l6-3c.07-.04.15-.05.23-.04s.15.05.21.11c.05.05.09.12.1.2s0 .16-.03.23" /></Svg>;
export { SolidCompass as ReactComponent };
