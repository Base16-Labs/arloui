import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTrafficSignal = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 13.5h-1.5v-6h1.5a.75.75 0 0 0 0-1.5h-1.5V3.75a1.5 1.5 0 0 0-1.5-1.5H6.75a1.5 1.5 0 0 0-1.5 1.5V6h-1.5a.75.75 0 0 0 0 1.5h1.5v6h-1.5a.75.75 0 0 0 0 1.5h1.5v5.25a1.5 1.5 0 0 0 1.5 1.5h10.5a1.5 1.5 0 0 0 1.5-1.5V15h1.5a.75.75 0 0 0 0-1.5M12 10.88c-.52 0-1.03-.16-1.46-.44-.43-.29-.77-.7-.97-1.18-.19-.48-.25-1.01-.14-1.52.1-.51.35-.98.71-1.34A2.62 2.62 0 0 1 13 5.83c.48.2.89.53 1.18.96.29.44.44.94.44 1.46 0 .7-.27 1.37-.76 1.86-.5.49-1.16.77-1.86.77m0 2.25c.52 0 1.03.15 1.46.44s.77.7.97 1.18c.19.48.25 1.01.14 1.51-.1.51-.35.98-.71 1.35a2.623 2.623 0 0 1-4.48-1.86A2.61 2.61 0 0 1 12 13.13" /></Svg>;
export { SolidTrafficSignal as ReactComponent };
