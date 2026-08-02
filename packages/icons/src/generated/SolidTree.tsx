import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTree = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 17.61c.241.16.491.31.75.44v3.7a.751.751 0 0 1-1.5 0v-3.7c.259-.13.509-.28.75-.44m6.572-11.74A7.12 7.12 0 0 0 12 1.5a7.117 7.117 0 0 0-6.572 4.37A6.725 6.725 0 0 0 1.5 11.98c-.009 3.58 3 6.68 6.576 6.77a6.7 6.7 0 0 0 3.174-.7v-3.33l-4.086-2.05a.74.74 0 0 1-.335-1 .74.74 0 0 1 .434-.38.76.76 0 0 1 .573.04l3.414 1.71V8.25a.751.751 0 0 1 1.5 0v2.54l3.414-1.71a1 1 0 0 1 .283-.08c.098 0 .197.01.29.04q.142.045.255.15a.7.7 0 0 1 .179.23.738.738 0 0 1-.104.82.63.63 0 0 1-.231.18l-4.086 2.05v5.58c.932.46 1.959.7 3 .7h.171c3.579-.09 6.589-3.19 6.579-6.77a6.72 6.72 0 0 0-3.928-6.11" /></Svg>;
export { SolidTree as ReactComponent };
export { SolidTree };
export default SolidTree;
