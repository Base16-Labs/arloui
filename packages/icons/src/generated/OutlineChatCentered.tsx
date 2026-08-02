import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChatCentered = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3H3.75a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h5.67l1.28 2.24c.13.23.32.42.55.55a1.44 1.44 0 0 0 1.5 0c.23-.13.42-.32.55-.55L14.58 18h5.67a1.5 1.5 0 0 0 1.5-1.5v-12a1.5 1.5 0 0 0-1.5-1.5m0 13.5h-6.1c-.13 0-.26.03-.38.1-.11.06-.21.16-.28.27l-1.5 2.63-1.5-2.63a.746.746 0 0 0-.65-.37H3.75v-12h16.5z" /></Svg>;
export { OutlineChatCentered as ReactComponent };
export { OutlineChatCentered };
export default OutlineChatCentered;
