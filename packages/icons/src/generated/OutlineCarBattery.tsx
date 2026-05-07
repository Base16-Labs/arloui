import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCarBattery = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18 13.5a.751.751 0 0 1-.75.75h-.75V15a.751.751 0 0 1-1.5 0v-.75h-.75a.751.751 0 0 1 0-1.5H15V12a.751.751 0 0 1 1.5 0v.75h.75a.75.75 0 0 1 .75.75m-8.25-.75h-3a.751.751 0 0 0 0 1.5h3a.751.751 0 0 0 0-1.5M22.5 9v9c0 .4-.158.78-.439 1.06s-.663.44-1.061.44H3c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 1.5 18V9c0-.4.158-.78.439-1.06S2.602 7.5 3 7.5h1.5V6c0-.4.158-.78.439-1.06S5.602 4.5 6 4.5h3c.398 0 .779.16 1.061.44S10.5 5.6 10.5 6v1.5h3V6c0-.4.158-.78.439-1.06S14.602 4.5 15 4.5h3c.398 0 .779.16 1.061.44S19.5 5.6 19.5 6v1.5H21c.398 0 .779.16 1.061.44S22.5 8.6 22.5 9M15 7.5h3V6h-3zm-9 0h3V6H6zM21 18V9H3v9z" /></Svg>;
export { OutlineCarBattery as ReactComponent };
