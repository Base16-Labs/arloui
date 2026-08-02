import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChatCenteredText = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M8.25 9A.75.75 0 0 1 9 8.25h6a.75.75 0 0 1 0 1.5H9A.75.75 0 0 1 8.25 9M9 12.75h6a.75.75 0 0 0 0-1.5H9a.75.75 0 0 0 0 1.5M21.75 4.5v12a1.5 1.5 0 0 1-1.5 1.5h-5.67l-1.28 2.24c-.13.23-.32.42-.55.55a1.44 1.44 0 0 1-1.5 0c-.23-.13-.42-.32-.55-.55L9.42 18H3.75a1.5 1.5 0 0 1-1.5-1.5v-12A1.5 1.5 0 0 1 3.75 3h16.5a1.5 1.5 0 0 1 1.5 1.5m-1.5 0H3.75v12h6.1c.13 0 .26.03.38.1.11.06.21.16.28.27l1.5 2.63 1.5-2.63a.746.746 0 0 1 .65-.37h6.09z" /></Svg>;
export { OutlineChatCenteredText as ReactComponent };
export { OutlineChatCenteredText };
export default OutlineChatCenteredText;
