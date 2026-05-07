import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePulse = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.5 12.376a.75.75 0 0 1-.75.75h-2.54l-3.54 7.08a.739.739 0 0 1-.67.42h-.04a.84.84 0 0 1-.4-.14.8.8 0 0 1-.26-.34L8.94 6.066l-3.01 6.62c-.06.13-.15.24-.27.32-.13.08-.27.12-.41.12h-3a.75.75 0 0 1 0-1.5h2.52l3.55-7.81a.718.718 0 0 1 .7-.44c.15 0 .29.05.42.14.12.08.21.2.26.34l5.39 14.16 2.99-5.98c.06-.12.16-.23.28-.3.11-.07.25-.11.39-.11h3a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlinePulse as ReactComponent };
