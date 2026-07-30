import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFloppyDisk = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.56 6.75-3.31-3.31a1.6 1.6 0 0 0-.486-.33A1.6 1.6 0 0 0 16.19 3H4.5c-.398 0-.779.16-1.061.44S3 4.1 3 4.5v15c0 .4.158.78.439 1.06S4.102 21 4.5 21h15c.398 0 .779-.16 1.061-.44S21 19.9 21 19.5V7.81a1.5 1.5 0 0 0-.113-.57 1.4 1.4 0 0 0-.327-.49M19.5 19.5h-2.25v-5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44h-7.5c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v5.25H4.5v-15h11.69l3.31 3.31zM15 6.75a.751.751 0 0 1-.75.75H9A.751.751 0 0 1 9 6h5.25a.75.75 0 0 1 .75.75" /></Svg>;
export { SolidFloppyDisk as ReactComponent };
