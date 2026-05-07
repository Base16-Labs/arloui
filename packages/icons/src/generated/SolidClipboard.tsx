import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidClipboard = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.75 3.375h-3.399A4.469 4.469 0 0 0 12 1.875a4.47 4.47 0 0 0-3.351 1.5H5.25c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v15.75c0 .4.158.78.439 1.06s.663.44 1.061.44h13.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V4.875c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-6.75 0c.796 0 1.559.32 2.121.88S15 5.575 15 6.375H9c0-.8.316-1.56.879-2.12A3 3 0 0 1 12 3.375" /></Svg>;
export { SolidClipboard as ReactComponent };
