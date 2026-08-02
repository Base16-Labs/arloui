import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTrafficSign = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m22.8 10.9-9.7-9.69A1.57 1.57 0 0 0 12 .75a1.572 1.572 0 0 0-1.1.46L1.2 10.9q-.21.225-.33.51a1.53 1.53 0 0 0 0 1.19c.08.18.19.36.33.5l9.7 9.7c.15.14.32.26.51.33.18.08.39.12.59.12s.41-.04.59-.12c.19-.07.36-.19.51-.33l9.7-9.7c.14-.14.25-.32.33-.5a1.53 1.53 0 0 0 0-1.19 1.7 1.7 0 0 0-.33-.51m-6.52.88-2.25 2.25a.75.75 0 1 1-1.06-1.06l.97-.97H10.5A1.5 1.5 0 0 0 9 13.5v.75a.75.75 0 0 1-1.5 0v-.75c0-.79.32-1.56.88-2.12s1.32-.88 2.12-.88h3.44l-.97-.97a.75.75 0 1 1 1.06-1.06l2.25 2.25c.07.07.13.15.16.25a.717.717 0 0 1 0 .57c-.03.09-.09.17-.16.24" /></Svg>;
export { SolidTrafficSign as ReactComponent };
export { SolidTrafficSign };
export default SolidTrafficSign;
