import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePi = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.125 15.745c0 .9-.356 1.75-.989 2.39-.632.63-1.491.99-2.386.99s-1.754-.36-2.386-.99a3.39 3.39 0 0 1-.989-2.39v-9.37h-6v12a.751.751 0 0 1-1.5 0v-12h-.75c-.995 0-1.948.39-2.652 1.09a3.77 3.77 0 0 0-1.098 2.66.751.751 0 0 1-1.5 0c.001-1.4.555-2.73 1.539-3.71a5.23 5.23 0 0 1 3.711-1.54h14.25a.751.751 0 0 1 0 1.5h-4.5v9.37a1.88 1.88 0 0 0 1.875 1.88 1.88 1.88 0 0 0 1.875-1.88.751.751 0 0 1 1.5 0" /></Svg>;
export { OutlinePi as ReactComponent };
export { OutlinePi };
export default OutlinePi;
