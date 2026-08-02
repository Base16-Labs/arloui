import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCodaLogo = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M16.5 8.25c.71-.01 1.41.19 2.02.57.17.11.36.17.56.18.21.01.41-.04.58-.14.18-.1.33-.24.43-.41.1-.18.16-.37.16-.57V4.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5v15a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-3.37c0-.21-.06-.4-.16-.58-.1-.17-.25-.31-.43-.41-.17-.1-.37-.14-.57-.14q-.315.015-.57.18c-.68.43-1.26.6-1.99.57h-.03c-1 0-1.95-.4-2.65-1.1-.71-.7-1.1-1.66-1.1-2.65s.39-1.95 1.1-2.65c.7-.7 1.65-1.1 2.65-1.1M11.25 12c0 1.39.55 2.72 1.53 3.71.98.98 2.31 1.53 3.7 1.54.79.04 1.57-.13 2.27-.48v2.73H5.25v-15h13.5v2.74c-.8-.37-1.69-.54-2.57-.48s-1.74.34-2.48.81c-.75.48-1.36 1.13-1.79 1.9-.43.78-.66 1.65-.66 2.53" /></Svg>;
export { OutlineCodaLogo as ReactComponent };
export { OutlineCodaLogo };
export default OutlineCodaLogo;
