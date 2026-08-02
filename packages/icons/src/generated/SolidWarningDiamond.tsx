import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWarningDiamond = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m22.055 10.94-9-9a1.5 1.5 0 0 0-2.12 0l-9 9c-.28.28-.43.66-.43 1.06s.15.78.43 1.06l9.01 9c.28.28.66.44 1.05.44.4 0 .78-.16 1.06-.44l9.01-9c.28-.28.43-.66.43-1.06s-.15-.78-.43-1.06zM11.245 7.5a.75.75 0 0 1 1.5 0v5.25a.75.75 0 0 1-1.5 0zm.75 9.75c-.22 0-.44-.07-.62-.19-.19-.12-.33-.3-.42-.5-.08-.21-.11-.44-.06-.65.04-.22.15-.42.3-.58.16-.16.36-.26.58-.31.22-.04.44-.02.65.07.21.08.38.23.51.41.12.19.19.4.19.63 0 .29-.12.58-.33.79-.22.21-.5.33-.8.33" /></Svg>;
export { SolidWarningDiamond as ReactComponent };
export { SolidWarningDiamond };
export default SolidWarningDiamond;
