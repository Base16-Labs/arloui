import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTerminalWindow = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M12 12a.758.758 0 0 1-.281.59l-3.75 3a.66.66 0 0 1-.26.13.72.72 0 0 1-.795-.25.75.75 0 0 1-.071-.83.7.7 0 0 1 .188-.22L10.049 12 7.031 9.59a.7.7 0 0 1-.188-.23.7.7 0 0 1-.089-.27.8.8 0 0 1 .025-.3.9.9 0 0 1 .135-.26.7.7 0 0 1 .224-.18.7.7 0 0 1 .279-.09.7.7 0 0 1 .292.02.7.7 0 0 1 .26.14l3.75 3A.76.76 0 0 1 12 12m4.5 2.25h-3.75a.751.751 0 0 0 0 1.5h3.75a.751.751 0 0 0 0-1.5m5.25-9v13.5c0 .4-.158.78-.439 1.06s-.663.44-1.061.44H3.75c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06V5.25c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h16.5c.398 0 .779.16 1.061.44s.439.66.439 1.06m-1.5 13.5V5.25H3.75v13.5z" /></Svg>;
export { OutlineTerminalWindow as ReactComponent };
