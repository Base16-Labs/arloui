import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCursorText = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3m-6 8.25a.75.75 0 0 1 0 1.5h-.75V15a1.5 1.5 0 0 0 1.5 1.5H15a.75.75 0 0 1 0 1.5h-.75c-.43 0-.85-.09-1.24-.26-.38-.18-.73-.44-1.01-.76-.28.32-.63.58-1.01.76-.39.17-.81.26-1.24.26H9a.75.75 0 0 1 0-1.5h.75a1.5 1.5 0 0 0 1.5-1.5v-2.25h-.75a.75.75 0 0 1 0-1.5h.75V9a1.5 1.5 0 0 0-1.5-1.5H9A.75.75 0 0 1 9 6h.75c.43 0 .85.09 1.24.27.38.17.73.43 1.01.75.28-.32.63-.58 1.01-.75.39-.18.81-.27 1.24-.27H15a.75.75 0 0 1 0 1.5h-.75a1.5 1.5 0 0 0-1.5 1.5v2.25z" /></Svg>;
export { SolidCursorText as ReactComponent };
