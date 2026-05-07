import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCameraPlus = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 5.625h-2.6l-1.06-1.59c-.13-.2-.32-.37-.54-.48-.21-.12-.45-.18-.7-.18H9.4c-.25 0-.49.06-.7.18-.22.11-.41.28-.54.48L7.1 5.625H4.5c-.6 0-1.17.23-1.59.66-.42.42-.66.99-.66 1.59v10.5c0 .59.24 1.17.66 1.59s.99.66 1.59.66h15c.6 0 1.17-.24 1.59-.66s.66-1 .66-1.59v-10.5c0-.6-.24-1.17-.66-1.59-.42-.43-.99-.66-1.59-.66m-4.5 8.25h-2.25v2.25a.75.75 0 0 1-1.5 0v-2.25H9a.75.75 0 0 1 0-1.5h2.25v-2.25a.75.75 0 0 1 1.5 0v2.25H15a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidCameraPlus as ReactComponent };
