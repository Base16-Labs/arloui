import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTeaBag = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M9.75 13.5v-6h1.83c.25 0 .51.07.73.2.23.13.42.31.55.53l1.93 3.21c.14.23.21.5.21.77V21a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 3 21v-8.79c0-.27.07-.54.21-.77l1.93-3.21c.13-.22.32-.4.55-.53.22-.13.48-.2.73-.2h1.83v6a.75.75 0 0 0 1.5 0m10.5 2.25a1.5 1.5 0 0 1-1.5-1.5v-7.5c0-1.39-.55-2.73-1.54-3.71A5.26 5.26 0 0 0 13.5 1.5c-1.39 0-2.73.56-3.71 1.54a5.22 5.22 0 0 0-1.54 3.71v.75h1.5v-.75c0-.99.4-1.95 1.1-2.65S12.51 3 13.5 3s1.95.4 2.65 1.1 1.1 1.66 1.1 2.65v7.5c0 .8.32 1.56.88 2.12.56.57 1.32.88 2.12.88a.75.75 0 0 0 0-1.5" /></Svg>;
export { SolidTeaBag as ReactComponent };
