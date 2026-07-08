import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPictureInPicture = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 4.5H3.75c-.398 0-.779.15-1.061.44-.281.28-.439.66-.439 1.06v12c0 .39.158.78.439 1.06s.663.44 1.061.44h16.5c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06V6c0-.4-.158-.78-.439-1.06a1.47 1.47 0 0 0-1.061-.44m0 13.5h-7.5v-6h7.5z" /></Svg>;
export { SolidPictureInPicture as ReactComponent };
