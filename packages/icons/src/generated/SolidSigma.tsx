import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSigma = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.75 2.25H5.25c-.398 0-.78.15-1.06.44-.282.28-.44.66-.44 1.06v16.5a1.506 1.506 0 0 0 1.5 1.5h13.5c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06V3.75c0-.4-.158-.78-.439-1.06a1.47 1.47 0 0 0-1.061-.44m-1.5 6a.751.751 0 0 1-1.5 0v-1.5H9l3.6 4.8c.097.13.15.28.15.45 0 .16-.053.32-.15.45L9 17.25h6.75v-1.5a.751.751 0 0 1 1.5 0V18a.751.751 0 0 1-.75.75h-9a.7.7 0 0 1-.394-.12.7.7 0 0 1-.277-.3.73.73 0 0 1-.076-.4.73.73 0 0 1 .147-.38L11.062 12 6.9 6.45a.77.77 0 0 1-.07-.79.75.75 0 0 1 .67-.41h9a.75.75 0 0 1 .75.75z" /></Svg>;
export { SolidSigma as ReactComponent };
