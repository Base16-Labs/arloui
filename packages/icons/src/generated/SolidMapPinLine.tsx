import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidMapPinLine = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.75 21h-4.637c.779-.7 1.513-1.44 2.199-2.23 2.574-2.96 3.938-6.08 3.938-9.02 0-2.19-.87-4.29-2.417-5.84A8.27 8.27 0 0 0 12 1.5c-2.188 0-4.287.87-5.834 2.41A8.27 8.27 0 0 0 3.75 9.75c0 2.94 1.36 6.06 3.937 9.02.686.79 1.421 1.53 2.199 2.23H5.25a.748.748 0 0 0-.531 1.28c.141.14.332.22.531.22h13.5a.753.753 0 0 0 .75-.75.753.753 0 0 0-.75-.75M12 6.75c.593 0 1.173.17 1.666.5.494.33.878.8 1.105 1.35s.287 1.15.171 1.73a3.03 3.03 0 0 1-.821 1.54c-.42.42-.954.7-1.536.82-.582.11-1.185.05-1.733-.17a3 3 0 0 1-1.347-1.11A3 3 0 0 1 9 9.75c0-.8.316-1.56.878-2.13A3 3 0 0 1 12 6.75" /></Svg>;
export { SolidMapPinLine as ReactComponent };
