import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTerminal = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m10.999 12.559-6.75 6a.7.7 0 0 1-.253.15.7.7 0 0 1-.29.04.7.7 0 0 1-.284-.07 1 1 0 0 1-.234-.18.73.73 0 0 1-.188-.54c.006-.1.032-.2.075-.29a.8.8 0 0 1 .177-.23l6.124-5.44-6.123-5.44a.732.732 0 0 1-.212-.8c.032-.1.083-.18.148-.26a.7.7 0 0 1 .233-.17.7.7 0 0 1 .284-.08c.099 0 .197.01.29.04q.142.045.254.15l6.75 6c.08.07.143.16.187.25a.754.754 0 0 1 0 .62.7.7 0 0 1-.187.25zm9.252 4.69h-9a.753.753 0 0 0-.75.75.746.746 0 0 0 .75.75h9a.753.753 0 0 0 .75-.75.753.753 0 0 0-.75-.75" /></Svg>;
export { OutlineTerminal as ReactComponent };
