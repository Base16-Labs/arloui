import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNoteBlank = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.4 0-.78.15-1.07.44C3.15 3.72 3 4.1 3 4.5v15c0 .39.15.78.43 1.06.29.28.67.44 1.07.44h10.18c.2 0 .4-.04.58-.12.18-.07.35-.18.49-.32l4.81-4.81c.14-.14.25-.31.32-.49.08-.18.12-.38.12-.57V4.5A1.5 1.5 0 0 0 19.5 3M15 19.19V15h4.18z" /></Svg>;
export { SolidNoteBlank as ReactComponent };
