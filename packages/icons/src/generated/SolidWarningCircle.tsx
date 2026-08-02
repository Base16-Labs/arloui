import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWarningCircle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.25a9.76 9.76 0 0 0-5.417 1.64 9.8 9.8 0 0 0-3.59 4.38 9.74 9.74 0 0 0 2.113 10.62 9.66 9.66 0 0 0 4.992 2.67c1.891.38 3.852.19 5.633-.55a9.8 9.8 0 0 0 4.376-3.59A9.78 9.78 0 0 0 21.75 12a9.77 9.77 0 0 0-2.859-6.89 9.74 9.74 0 0 0-6.89-2.86m-.75 5.25a.751.751 0 0 1 1.5 0v5.25a.751.751 0 0 1-1.5 0zm.75 9.75c-.222 0-.44-.07-.625-.19s-.329-.3-.414-.5a1.133 1.133 0 0 1 .244-1.23c.157-.16.357-.26.576-.31.218-.04.444-.02.65.07a1.11 1.11 0 0 1 .694 1.04A1.126 1.126 0 0 1 12 17.25" /></Svg>;
export { SolidWarningCircle as ReactComponent };
export { SolidWarningCircle };
export default SolidWarningCircle;
