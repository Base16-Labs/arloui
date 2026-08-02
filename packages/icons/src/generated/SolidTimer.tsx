import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTimer = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 4.498a8.99 8.99 0 0 0-8.31 5.56 9 9 0 0 0-.52 5.2 9.06 9.06 0 0 0 2.47 4.61 8.97 8.97 0 0 0 4.6 2.46 8.983 8.983 0 0 0 9.24-3.83 9 9 0 0 0 1.52-5c0-2.38-.95-4.67-2.64-6.36A9.03 9.03 0 0 0 12 4.498m4.28 5.78-3.75 3.75c-.07.07-.15.13-.24.17a1 1 0 0 1-.29.05c-.1 0-.2-.02-.29-.05a.8.8 0 0 1-.24-.17.6.6 0 0 1-.16-.24.72.72 0 0 1 0-.57c.03-.1.09-.18.16-.25l3.75-3.75a.78.78 0 0 1 .53-.22.776.776 0 0 1 .53.22c.07.07.13.15.16.25a.717.717 0 0 1 0 .57c-.03.09-.09.17-.16.24M9 2.248a.75.75 0 0 1 .75-.75h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1-.75-.75" /></Svg>;
export { SolidTimer as ReactComponent };
export { SolidTimer };
export default SolidTimer;
