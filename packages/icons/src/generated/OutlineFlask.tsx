import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFlask = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.782 19.105-5.783-9.64v-5.34h.75a.751.751 0 0 0 0-1.5h-7.5a.751.751 0 0 0 0 1.5h.75v5.34l-5.783 9.64a1.504 1.504 0 0 0 .529 2.07c.228.13.489.2.753.2h15c.265 0 .526-.07.755-.2.23-.14.42-.33.55-.56a1.5 1.5 0 0 0-.018-1.51zm-10.39-9.05q.106-.18.107-.39v-5.54h3v5.54q.001.21.106.39l3.584 5.98c-1.125.22-2.726.13-4.853-.95-1.49-.76-2.91-1.16-4.238-1.2zm-5.893 9.82 2.676-4.46c1.336-.16 2.84.17 4.483 1 1.78.91 3.28 1.21 4.5 1.21.62.01 1.236-.08 1.832-.25l1.509 2.5z" /></Svg>;
export { OutlineFlask as ReactComponent };
export { OutlineFlask };
export default OutlineFlask;
