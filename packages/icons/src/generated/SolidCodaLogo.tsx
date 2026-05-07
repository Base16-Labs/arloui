import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCodaLogo = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12.75 12c0 .99.39 1.95 1.1 2.65.7.7 1.65 1.1 2.65 1.1h.03c.73.03 1.31-.14 1.99-.57q.255-.165.57-.18c.2 0 .4.04.57.14.18.1.33.24.43.41.1.18.16.37.16.58v3.37a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-15A1.5 1.5 0 0 1 5.25 3h13.5a1.5 1.5 0 0 1 1.5 1.5v3.38c0 .2-.06.39-.16.57-.1.17-.25.31-.43.41-.17.1-.37.15-.58.14-.2-.01-.39-.07-.56-.18-.57-.35-1.23-.55-1.9-.57s-1.33.14-1.92.47c-.59.32-1.08.8-1.42 1.37-.35.58-.53 1.24-.53 1.91" /></Svg>;
export { SolidCodaLogo as ReactComponent };
