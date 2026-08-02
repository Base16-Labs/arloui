import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFunnel = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m21.353 5.51-.01.01-6.35 6.78v5.2c.01.25-.06.49-.17.71-.12.22-.29.4-.49.54l-3 2a1.5 1.5 0 0 1-1.54.07c-.24-.12-.44-.31-.58-.55-.14-.23-.22-.5-.22-.77v-7.2l-6.34-6.78-.01-.01c-.2-.22-.33-.48-.37-.77-.05-.29-.01-.58.11-.85.11-.26.3-.49.55-.65.24-.15.52-.24.81-.24h16.5c.3 0 .58.09.82.24.25.16.44.39.56.65.11.27.15.56.11.85-.05.29-.18.55-.38.77" /></Svg>;
export { SolidFunnel as ReactComponent };
export { SolidFunnel };
export default SolidFunnel;
