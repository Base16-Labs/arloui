import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTrafficCone = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 19.875h-1.72l-5.65-16.24c-.1-.29-.29-.55-.54-.73-.26-.18-.56-.28-.87-.28h-1.94c-.31 0-.61.1-.87.28-.25.18-.44.44-.54.73l-5.65 16.24H2.25a.75.75 0 0 0 0 1.5h19.5a.75.75 0 0 0 0-1.5m-12.8-9.75h6.1l1.57 4.5H7.38z" /></Svg>;
export { SolidTrafficCone as ReactComponent };
