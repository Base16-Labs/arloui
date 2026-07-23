import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePictureInPicture = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 4.5H3.75c-.398 0-.779.15-1.061.44-.281.28-.439.66-.439 1.06v12c0 .39.158.78.439 1.06s.663.44 1.061.44h16.5c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06V6c0-.4-.158-.78-.439-1.06a1.47 1.47 0 0 0-1.061-.44M3.75 6h16.5v5.25h-7.5A.75.75 0 0 0 12 12v6H3.75zm16.5 12H13.5v-5.25h6.75z" /></Svg>;
export { OutlinePictureInPicture as ReactComponent };
