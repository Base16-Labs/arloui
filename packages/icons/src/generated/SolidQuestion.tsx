import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidQuestion = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.25a9.76 9.76 0 0 0-5.417 1.64A9.765 9.765 0 0 0 2.437 13.9a9.74 9.74 0 0 0 2.67 4.99 9.73 9.73 0 0 0 4.991 2.67c1.891.38 3.852.18 5.633-.55a9.8 9.8 0 0 0 4.376-3.59A9.78 9.78 0 0 0 21.75 12a9.74 9.74 0 0 0-2.859-6.89 9.74 9.74 0 0 0-6.89-2.86M12 18c-.222 0-.44-.07-.625-.19s-.329-.3-.414-.51a1.11 1.11 0 0 1 .244-1.22c.157-.16.357-.27.576-.31a1.2 1.2 0 0 1 .65.06c.205.09.381.23.504.42.124.18.19.4.19.62A1.127 1.127 0 0 1 12 18m.75-4.57v.07a.751.751 0 0 1-1.5 0v-.75A.751.751 0 0 1 12 12c1.24 0 2.25-.85 2.25-1.88S13.24 8.25 12 8.25s-2.25.84-2.25 1.87v.38a.751.751 0 0 1-1.5 0v-.38c0-1.86 1.682-3.37 3.75-3.37s3.75 1.51 3.75 3.37c0 1.63-1.29 3-3 3.31" /></Svg>;
export { SolidQuestion as ReactComponent };
export { SolidQuestion };
export default SolidQuestion;
