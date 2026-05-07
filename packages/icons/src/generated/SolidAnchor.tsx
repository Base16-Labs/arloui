import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidAnchor = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 12.938c0 3.573-2.59 4.28-4.68 4.849-2.28.622-3.57 1.085-3.57 3.4a.751.751 0 0 1-1.5 0c0-2.315-1.29-2.779-3.57-3.4C5.6 17.218 3 16.51 3 12.937a.751.751 0 0 1 1.5 0c0 2.316 1.29 2.78 3.57 3.402 1.07.29 2.26.619 3.18 1.345v-6.247h-3a.751.751 0 0 1 0-1.5h3V7.204A2.63 2.63 0 0 1 9.4 4.309c.09-.625.41-1.195.88-1.608A2.64 2.64 0 0 1 12 2.063c.63 0 1.24.228 1.72.64s.79.982.88 1.607c.09.624-.05 1.26-.39 1.79-.34.532-.85.923-1.46 1.103v2.736h3a.751.751 0 0 1 0 1.5h-3v6.245c.92-.726 2.11-1.053 3.18-1.344 2.28-.622 3.57-1.086 3.57-3.401a.751.751 0 0 1 1.5 0" /></Svg>;
export { SolidAnchor as ReactComponent };
