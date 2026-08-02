import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineDot = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M13.125 12.003c0 .22-.066.44-.19.62-.123.19-.299.33-.504.42-.206.08-.432.11-.65.06a1.1 1.1 0 0 1-.576-.31 1.07 1.07 0 0 1-.308-.57c-.044-.22-.022-.45.064-.65.085-.21.229-.38.414-.51.185-.12.402-.19.625-.19a1.127 1.127 0 0 1 1.125 1.13" /></Svg>;
export { OutlineDot as ReactComponent };
export { OutlineDot };
export default OutlineDot;
