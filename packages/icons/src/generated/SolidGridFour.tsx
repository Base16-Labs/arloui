import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidGridFour = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 5.25v5.62c0 .1-.04.2-.11.27s-.17.11-.26.11h-7.13V4.12c0-.1.04-.19.11-.26s.17-.11.26-.11h5.63c.4 0 .78.15 1.06.44.28.28.44.66.44 1.06m-9.37-1.5H5.25c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v5.62c0 .1.04.2.11.27s.17.11.26.11h7.13V4.12c0-.1-.04-.19-.11-.26a.38.38 0 0 0-.26-.11m9 9h-7.13v7.12c0 .1.04.2.11.27s.17.11.26.11h5.63a1.5 1.5 0 0 0 1.5-1.5v-5.63c0-.1-.04-.19-.11-.26a.38.38 0 0 0-.26-.11m-16.13.37v5.63a1.499 1.499 0 0 0 1.5 1.5h5.63c.09 0 .19-.04.26-.11s.11-.17.11-.27v-7.12H4.12c-.09 0-.19.04-.26.11s-.11.16-.11.26" /></Svg>;
export { SolidGridFour as ReactComponent };
