import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineNewspaper = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M9 10.5a.751.751 0 0 1 .75-.75h7.5a.751.751 0 0 1 0 1.5h-7.5A.75.75 0 0 1 9 10.5m.75 3.75h7.5a.751.751 0 0 0 0-1.5h-7.5a.751.751 0 0 0 0 1.5M22.5 6v11.25a2.256 2.256 0 0 1-2.25 2.25H3.75c-.595 0-1.166-.24-1.587-.66a2.25 2.25 0 0 1-.663-1.58V8.25a.751.751 0 0 1 1.5 0v9a.751.751 0 0 0 1.5 0V6c0-.4.158-.78.439-1.06.282-.29.663-.44 1.061-.44h15c.398 0 .779.15 1.061.44.281.28.439.66.439 1.06M21 6H6v11.25c0 .25-.043.51-.128.75H20.25a.75.75 0 0 0 .75-.75z" /></Svg>;
export { OutlineNewspaper as ReactComponent };
