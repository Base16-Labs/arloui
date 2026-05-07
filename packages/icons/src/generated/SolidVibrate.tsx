import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidVibrate = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M17.25 5.25v13.5c0 .6-.237 1.17-.659 1.59S15.597 21 15 21H9c-.597 0-1.169-.24-1.591-.66a2.24 2.24 0 0 1-.659-1.59V5.25c0-.6.237-1.17.659-1.59S8.403 3 9 3h6c.597 0 1.169.24 1.591.66s.659.99.659 1.59M19.5 7.5a.75.75 0 0 0-.75.75v7.5a.751.751 0 0 0 1.5 0v-7.5a.751.751 0 0 0-.75-.75m3 1.5a.75.75 0 0 0-.75.75v4.5a.751.751 0 0 0 1.5 0v-4.5A.751.751 0 0 0 22.5 9m-18-1.5a.75.75 0 0 0-.75.75v7.5a.751.751 0 0 0 1.5 0v-7.5a.751.751 0 0 0-.75-.75M1.5 9a.75.75 0 0 0-.75.75v4.5a.751.751 0 0 0 1.5 0v-4.5A.751.751 0 0 0 1.5 9" /></Svg>;
export { SolidVibrate as ReactComponent };
