import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMouseScroll = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M13.5 1.5h-3c-1.59 0-3.12.63-4.24 1.76A5.97 5.97 0 0 0 4.5 7.5v9c0 1.59.63 3.11 1.76 4.24a6.05 6.05 0 0 0 4.24 1.76h3c1.59-.01 3.12-.64 4.24-1.76a5.99 5.99 0 0 0 1.76-4.24v-9c0-1.59-.63-3.12-1.76-4.24A5.97 5.97 0 0 0 13.5 1.5m.22 13.72a.7.7 0 0 1 .53-.22c.2 0 .39.07.53.22a.75.75 0 0 1 0 1.06l-2.25 2.25a.78.78 0 0 1-.53.22.776.776 0 0 1-.53-.22l-2.25-2.25a.75.75 0 0 1 0-1.06.7.7 0 0 1 .53-.22c.2 0 .39.07.53.22l.97.97V7.81l-.97.97a.75.75 0 1 1-1.06-1.06l2.25-2.25c.07-.07.15-.13.24-.17a1 1 0 0 1 .29-.05c.1 0 .2.02.29.05.09.04.17.1.24.17l2.25 2.25c.07.07.13.15.16.24a.72.72 0 0 1 0 .57c-.03.09-.09.18-.16.25a.78.78 0 0 1-.53.22.776.776 0 0 1-.53-.22l-.97-.97v8.38z" /></Svg>;
export { SolidMouseScroll as ReactComponent };
export { SolidMouseScroll };
export default SolidMouseScroll;
