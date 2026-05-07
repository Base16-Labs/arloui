import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidUser = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.65 21.005c-.07.11-.16.21-.28.27-.11.07-.24.1-.37.1H3a.75.75 0 0 1-.65-.37.75.75 0 0 1-.1-.38c0-.13.03-.26.1-.37 1.43-2.47 3.63-4.24 6.19-5.08a6.75 6.75 0 0 1-2.8-3.28 6.7 6.7 0 0 1-.25-4.31 6.72 6.72 0 0 1 2.42-3.58c1.17-.9 2.61-1.38 4.09-1.38s2.91.48 4.09 1.38c1.17.9 2.02 2.15 2.42 3.58.39 1.42.3 2.94-.25 4.31a6.77 6.77 0 0 1-2.81 3.28c2.57.84 4.77 2.61 6.2 5.08.06.11.1.24.1.37s-.04.26-.1.38" /></Svg>;
export { SolidUser as ReactComponent };
