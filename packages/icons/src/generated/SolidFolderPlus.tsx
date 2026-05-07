import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFolderPlus = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 6.75h-7.94L9.75 4.19a1.6 1.6 0 0 0-.486-.33 1.6 1.6 0 0 0-.574-.11H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v13.56a1.442 1.442 0 0 0 1.443 1.44h16.64c.376 0 .736-.15 1.002-.41.265-.27.415-.63.415-1.01V8.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-16.5-1.5h4.94l1.5 1.5H3.75zm10.5 9h-1.5v1.5a.751.751 0 0 1-1.5 0v-1.5h-1.5a.751.751 0 0 1 0-1.5h1.5v-1.5a.751.751 0 0 1 1.5 0v1.5h1.5a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidFolderPlus as ReactComponent };
