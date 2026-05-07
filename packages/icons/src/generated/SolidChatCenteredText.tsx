import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidChatCenteredText = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3H3.75a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h5.67l1.28 2.24c.13.23.32.42.55.55a1.44 1.44 0 0 0 1.5 0c.23-.13.42-.32.55-.55L14.58 18h5.67a1.5 1.5 0 0 0 1.5-1.5v-12a1.5 1.5 0 0 0-1.5-1.5M15 12.75H9a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 0 1.5m0-3H9a.75.75 0 0 1 0-1.5h6a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidChatCenteredText as ReactComponent };
