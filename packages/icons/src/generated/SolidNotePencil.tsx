import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNotePencil = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.625 12.375v7.5c0 .39-.159.78-.44 1.06s-.662.44-1.06.44h-15c-.398 0-.78-.16-1.061-.44a1.5 1.5 0 0 1-.44-1.06v-15c0-.4.159-.78.44-1.06.281-.29.663-.44 1.06-.44h7.5a.751.751 0 0 1 0 1.5h-7.5v15h15v-7.5a.751.751 0 0 1 1.5 0m.53-5.47-9 9a.78.78 0 0 1-.53.22h-3a.75.75 0 0 1-.75-.75v-3a.75.75 0 0 1 .219-.53l9-9c.07-.07.152-.13.243-.17a1 1 0 0 1 .288-.05 1 1 0 0 1 .287.05c.09.04.174.1.244.17l3 3a.75.75 0 0 1 .22.53.791.791 0 0 1-.22.53m-1.594-.53-1.936-1.94-1.19 1.19 1.94 1.94z" /></Svg>;
export { SolidNotePencil as ReactComponent };
export { SolidNotePencil };
export default SolidNotePencil;
