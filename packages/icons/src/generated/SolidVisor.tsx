import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidVisor = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M17.16 5.25H6.75c-.913 0-1.817.19-2.657.55-.84.35-1.597.88-2.228 1.54-.63.66-1.12 1.44-1.44 2.3-.318.86-.46 1.77-.418 2.68.159 3.44 2.978 6.26 6.417 6.42 1.485.07 3-.55 4.63-1.9a1.49 1.49 0 0 1 1.898 0c.99.82 2.517 1.91 4.298 1.91a6.8 6.8 0 0 0 2.604-.52 6.78 6.78 0 0 0 3.658-3.71c.334-.83.5-1.71.488-2.61-.048-3.67-3.116-6.66-6.84-6.66m-.66 4.5h-9A.753.753 0 0 1 6.75 9a.753.753 0 0 1 .75-.75h9a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidVisor as ReactComponent };
