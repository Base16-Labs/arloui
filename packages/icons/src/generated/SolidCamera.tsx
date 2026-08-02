import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCamera = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 5.625h-2.6l-1.28-1.92a.7.7 0 0 0-.27-.24.73.73 0 0 0-.35-.09H9a.73.73 0 0 0-.35.09c-.11.05-.2.14-.27.24L7.1 5.625H4.5c-.6 0-1.17.23-1.59.66-.42.42-.66.99-.66 1.59v10.5c0 .59.24 1.17.66 1.59s.99.66 1.59.66h15c.6 0 1.17-.24 1.59-.66s.66-1 .66-1.59v-10.5c0-.6-.24-1.17-.66-1.59-.42-.43-.99-.66-1.59-.66m-4.12 7.12a3.358 3.358 0 0 1-2.09 3.12c-.62.26-1.29.32-1.95.19-.65-.13-1.25-.45-1.73-.92a3.36 3.36 0 0 1-.92-1.73c-.13-.65-.06-1.33.19-1.95.26-.62.69-1.14 1.24-1.51.56-.37 1.21-.57 1.88-.57a3.378 3.378 0 0 1 3.38 3.37" /></Svg>;
export { SolidCamera as ReactComponent };
export { SolidCamera };
export default SolidCamera;
