import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFolder = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 6.75h-7.94L9.75 4.19c-.14-.14-.3-.25-.49-.33-.18-.07-.37-.11-.57-.11H3.75a1.5 1.5 0 0 0-1.5 1.5v13.56c0 .38.15.75.42 1.02s.64.42 1.02.42h16.64a1.415 1.415 0 0 0 1.42-1.42V8.25a1.5 1.5 0 0 0-1.5-1.5m-16.5-1.5h4.94l1.5 1.5H3.75z" /></Svg>;
export { SolidFolder as ReactComponent };
export { SolidFolder };
export default SolidFolder;
