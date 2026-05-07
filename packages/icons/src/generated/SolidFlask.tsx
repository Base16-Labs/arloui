import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFlask = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m20.782 19.105-5.783-9.64v-5.34h.75a.751.751 0 0 0 0-1.5h-7.5a.751.751 0 0 0 0 1.5h.75v5.34l-5.783 9.64a1.504 1.504 0 0 0 .529 2.07c.228.13.489.2.753.2h15c.265 0 .526-.07.755-.2.23-.14.42-.33.55-.56a1.5 1.5 0 0 0-.018-1.51zm-8.445-4.02c-1.492-.76-2.91-1.16-4.24-1.2l2.295-3.83q.106-.18.107-.39v-5.54h3v5.54q.001.21.106.39l3.584 5.98c-1.122.22-2.726.12-4.853-.95" /></Svg>;
export { SolidFlask as ReactComponent };
