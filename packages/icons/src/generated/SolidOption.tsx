import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidOption = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v13.5a1.499 1.499 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44m-1.5 12.75h-4.41c-.28 0-.55-.08-.79-.23-.24-.14-.43-.35-.55-.6L9.66 9H5.25a.75.75 0 0 1 0-1.5h4.41c.28 0 .55.07.79.22s.43.36.55.6L14.34 15h4.41a.75.75 0 0 1 0 1.5m0-7.5h-4.5a.75.75 0 0 1 0-1.5h4.5a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidOption as ReactComponent };
export { SolidOption };
export default SolidOption;
