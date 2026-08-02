import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidRadio = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 7.485H8.11l10.11-3.03c.19-.06.35-.19.44-.37.09-.17.12-.38.06-.57a.753.753 0 0 0-.94-.5l-15 4.5c-.15.05-.29.14-.38.27-.1.13-.15.29-.15.45v11.25a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5v-10.5a1.5 1.5 0 0 0-1.5-1.5m-10.5 10.5H6a.75.75 0 0 1 0-1.5h3.75a.75.75 0 0 1 0 1.5m0-3H6a.75.75 0 0 1 0-1.5h3.75a.75.75 0 0 1 0 1.5m0-3H6a.75.75 0 0 1 0-1.5h3.75a.75.75 0 0 1 0 1.5m6 5.25c-.59 0-1.17-.18-1.67-.51-.49-.33-.87-.8-1.1-1.34-.23-.55-.29-1.16-.17-1.74.11-.58.4-1.11.82-1.53s.95-.71 1.53-.82c.59-.12 1.19-.06 1.74.17.55.22 1.01.61 1.34 1.1a2.99 2.99 0 0 1-.37 3.79c-.56.56-1.32.88-2.12.88" /></Svg>;
export { SolidRadio as ReactComponent };
export { SolidRadio };
export default SolidRadio;
