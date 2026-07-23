import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineNotebook = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M17.25 10.5a.751.751 0 0 1-.75.75h-6a.751.751 0 0 1 0-1.5h6a.75.75 0 0 1 .75.75m-.75 2.25h-6a.751.751 0 0 0 0 1.5h6a.751.751 0 0 0 0-1.5M21 4.5v15c0 .39-.158.78-.439 1.06s-.663.44-1.061.44h-15c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 3 19.5v-15c0-.4.158-.78.439-1.06C3.721 3.15 4.102 3 4.5 3h15c.398 0 .779.15 1.061.44.281.28.439.66.439 1.06m-16.5 15h2.25v-15H4.5zm15 0v-15H8.25v15z" /></Svg>;
export { OutlineNotebook as ReactComponent };
