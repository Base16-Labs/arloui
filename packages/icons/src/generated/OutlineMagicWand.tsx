import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineMagicWand = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M3.375 6a.75.75 0 0 1 .75-.75h1.5v-1.5a.75.75 0 0 1 1.5 0v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 1 1-1.5 0v-1.5h-1.5a.75.75 0 0 1-.75-.75m12.75 12h-.75v-.75a.75.75 0 0 0-1.5 0V18h-.75a.75.75 0 0 0 0 1.5h.75v.75a.75.75 0 1 0 1.5 0v-.75h.75a.75.75 0 0 0 0-1.5m5.25-4.5h-1.5V12a.75.75 0 0 0-1.5 0v1.5h-1.5a.75.75 0 0 0 0 1.5h1.5v1.5a.75.75 0 1 0 1.5 0V15h1.5a.75.75 0 0 0 0-1.5m-1.94-6L6.375 20.56a1.5 1.5 0 0 1-2.12 0l-1.94-1.94c-.14-.14-.25-.31-.33-.49-.07-.18-.11-.38-.11-.57 0-.2.04-.4.11-.58q.12-.27.33-.48l13.06-13.06c.14-.14.3-.25.49-.33a1.56 1.56 0 0 1 1.15 0q.27.12.48.33l1.94 1.93c.14.14.25.31.33.49.07.18.11.38.11.58 0 .19-.04.39-.11.57-.08.18-.19.35-.33.49m-5.12 3-1.94-1.94-9 9 1.94 1.94zm4.06-4.06-1.94-1.94-3 3 1.94 1.94z" /></Svg>;
export { OutlineMagicWand as ReactComponent };
export { OutlineMagicWand };
export default OutlineMagicWand;
