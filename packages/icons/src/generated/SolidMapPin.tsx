import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMapPin = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 1.5c-2.188 0-4.285.87-5.831 2.42A8.24 8.24 0 0 0 3.75 9.75c0 7.06 7.5 12.39 7.819 12.61.126.09.277.14.431.14a.74.74 0 0 0 .43-.14c.32-.22 7.82-5.55 7.82-12.61a8.25 8.25 0 0 0-2.419-5.83A8.24 8.24 0 0 0 12 1.5m0 5.25c.593 0 1.173.17 1.666.5.494.33.878.8 1.105 1.35s.287 1.15.171 1.73a3.03 3.03 0 0 1-.821 1.54c-.42.42-.954.7-1.536.82-.582.11-1.185.05-1.733-.17a3 3 0 0 1-1.347-1.11A3 3 0 0 1 9 9.75c0-.8.316-1.56.878-2.13A3 3 0 0 1 12 6.75" /></Svg>;
export { SolidMapPin as ReactComponent };
export { SolidMapPin };
export default SolidMapPin;
