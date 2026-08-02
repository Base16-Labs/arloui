import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPaintBrush = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 3.375a.751.751 0 0 0-.75-.75c-4.133 0-8.373 4.66-10.728 7.74a5.7 5.7 0 0 0-2.598-.16c-.867.15-1.687.5-2.394 1.02a5.56 5.56 0 0 0-1.678 1.99 5.6 5.6 0 0 0-.602 2.53c0 2.9-1.832 4.19-1.92 4.25a.74.74 0 0 0-.287.38.75.75 0 0 0-.01.47c.047.15.142.28.27.38.13.09.286.15.447.15h7.125a5.6 5.6 0 0 0 2.532-.61 5.6 5.6 0 0 0 1.99-1.67 5.65 5.65 0 0 0 .856-5c3.087-2.35 7.747-6.59 7.747-10.72m-10.086 7.64c.32-.41.637-.81.946-1.17a7.1 7.1 0 0 1 1.92 1.92c-.368.3-.76.62-1.175.94a5.7 5.7 0 0 0-1.691-1.69m4.003-.25a8.5 8.5 0 0 0-2.062-2.06c2.979-3.24 5.226-4.22 6.553-4.49-.267 1.32-1.253 3.57-4.491 6.55" /></Svg>;
export { SolidPaintBrush as ReactComponent };
export { SolidPaintBrush };
export default SolidPaintBrush;
