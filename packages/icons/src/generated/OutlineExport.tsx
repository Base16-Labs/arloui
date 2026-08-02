import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineExport = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 11.25v9c0 .4-.16.78-.44 1.07-.28.28-.66.43-1.06.43H5.25c-.4 0-.78-.15-1.06-.43a1.54 1.54 0 0 1-.44-1.07v-9c0-.39.16-.77.44-1.06.28-.28.66-.44 1.06-.44H7.5c.2 0 .39.08.53.22.14.15.22.34.22.53 0 .2-.08.39-.22.54a.74.74 0 0 1-.53.21H5.25v9h13.5v-9H16.5a.74.74 0 0 1-.53-.21.8.8 0 0 1-.22-.54c0-.19.08-.38.22-.53a.75.75 0 0 1 .53-.22h2.25c.4 0 .78.16 1.06.44.28.29.44.67.44 1.06M8.78 7.29l2.47-2.47v8.68c0 .2.08.39.22.54.14.14.33.21.53.21s.39-.07.53-.21a.8.8 0 0 0 .22-.54V4.82l2.47 2.47a.75.75 0 0 0 1.06 0 .8.8 0 0 0 .22-.54c0-.19-.08-.38-.22-.53l-3.75-3.75a.78.78 0 0 0-.53-.22.776.776 0 0 0-.53.22L7.72 6.22c-.14.15-.22.34-.22.53 0 .2.08.39.22.54a.75.75 0 0 0 1.06 0" /></Svg>;
export { OutlineExport as ReactComponent };
export { OutlineExport };
export default OutlineExport;
