import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWaveformSlash = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.398 0-.78.16-1.06.44-.282.28-.44.66-.44 1.06v13.5a1.506 1.506 0 0 0 1.5 1.5h16.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-3 5.25a.751.751 0 0 1 1.5 0v4.76a.751.751 0 0 1-1.5 0zm-3 .75a.751.751 0 0 1 1.5 0v1.01a.751.751 0 0 1-1.5 0zm-7.5 4.5a.753.753 0 0 1-1.28.53.75.75 0 0 1-.22-.53v-4.5a.753.753 0 0 1 1.28-.53c.141.14.22.33.22.53zm11.781 4.28a.64.64 0 0 1-.244.16.7.7 0 0 1-.574 0 .64.64 0 0 1-.244-.16l-4.719-4.72v1.94a.751.751 0 0 1-1.5 0v-3.44l-1.5-1.5v6.44a.751.751 0 0 1-1.5 0V9.31L5.47 6.53a.746.746 0 0 1 0-1.06.754.754 0 0 1 1.06 0l12.001 12a.75.75 0 0 1 0 1.06" /></Svg>;
export { SolidWaveformSlash as ReactComponent };
