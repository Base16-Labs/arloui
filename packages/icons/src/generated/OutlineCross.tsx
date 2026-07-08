import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCross = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.75 6.75H15V3c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 13.5 1.5h-3c-.398 0-.779.16-1.061.44S9 2.6 9 3v3.75H5.25c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v3c0 .4.158.78.439 1.06s.663.44 1.061.44H9V21c0 .4.158.78.439 1.06s.663.44 1.061.44h3c.398 0 .779-.16 1.061-.44S15 21.4 15 21v-8.25h3.75c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-3c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m0 4.5h-4.5a.75.75 0 0 0-.75.75v9h-3v-9a.751.751 0 0 0-.75-.75h-4.5v-3h4.5a.75.75 0 0 0 .75-.75V3h3v4.5a.751.751 0 0 0 .75.75h4.5z" /></Svg>;
export { OutlineCross as ReactComponent };
