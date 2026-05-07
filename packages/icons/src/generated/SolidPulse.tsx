import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPulse = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m-.75 9h-1.82l-2.77 4.87a.75.75 0 0 1-.66.38h-.04a.8.8 0 0 1-.39-.14.7.7 0 0 1-.25-.32L9.66 8.43l-2.25 3.94c-.07.12-.17.21-.28.28-.12.07-.25.1-.38.1H4.5a.75.75 0 0 1 0-1.5h1.82L9.1 6.37a.7.7 0 0 1 .29-.28c.12-.07.26-.1.4-.09.14 0 .28.05.39.13s.2.19.26.32l3.9 9.12 2.25-3.94a.75.75 0 0 1 .66-.38h2.25c.19 0 .38.08.53.22a.75.75 0 0 1 0 1.06c-.15.14-.34.22-.53.22" /></Svg>;
export { SolidPulse as ReactComponent };
