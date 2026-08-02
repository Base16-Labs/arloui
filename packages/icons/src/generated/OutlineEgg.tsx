import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineEgg = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M17.5 5.58C15.8 3.03 13.74 1.5 12 1.5c-1.73 0-3.79 1.53-5.5 4.08-1.74 2.63-2.75 5.78-2.75 8.67 0 2.19.87 4.29 2.42 5.83A8.25 8.25 0 0 0 12 22.5c2.19 0 4.29-.87 5.84-2.42a8.25 8.25 0 0 0 2.41-5.83c0-2.89-1-6.04-2.75-8.67M12 21c-1.79 0-3.5-.72-4.77-1.98a6.82 6.82 0 0 1-1.98-4.77c0-2.6.92-5.45 2.5-7.84C9.12 4.37 10.82 3 12 3s2.89 1.37 4.25 3.41c1.59 2.39 2.5 5.24 2.5 7.84A6.76 6.76 0 0 1 12 21" /></Svg>;
export { OutlineEgg as ReactComponent };
export { OutlineEgg };
export default OutlineEgg;
