import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidElevator = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.499 1.499 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15c.4 0 .78-.16 1.06-.44.29-.28.44-.66.44-1.06v-15c0-.4-.15-.78-.44-1.06-.28-.28-.66-.44-1.06-.44m-9 2.25h3c.2 0 .39.08.53.22.15.14.22.33.22.53s-.07.39-.22.53a.75.75 0 0 1-.53.22h-3a.75.75 0 1 1 0-1.5m.75 14.25H6V9h5.25zm6.75 0h-5.25V9H18z" /></Svg>;
export { SolidElevator as ReactComponent };
