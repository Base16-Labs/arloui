import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBag = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 7.125H16.5a4.5 4.5 0 0 0-9 0H3.75a1.5 1.5 0 0 0-1.5 1.5v11.25a1.5 1.5 0 0 0 1.5 1.5h16.5a1.503 1.503 0 0 0 1.5-1.5V8.625a1.5 1.5 0 0 0-1.5-1.5M9 10.875a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0zm3-6.75a3 3 0 0 1 3 3H9a3 3 0 0 1 3-3m4.5 6.75a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0z" /></Svg>;
export { SolidBag as ReactComponent };
