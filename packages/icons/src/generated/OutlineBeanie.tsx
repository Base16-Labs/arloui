import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBeanie = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 16.326v-1.702a9.02 9.02 0 0 0-6.782-8.719 2.63 2.63 0 0 0 .082-2.67 2.628 2.628 0 0 0-4.6 0 2.634 2.634 0 0 0 .082 2.67A9.02 9.02 0 0 0 3 14.624v1.702a1.5 1.5 0 0 0-.75 1.298v3a1.503 1.503 0 0 0 1.5 1.5h16.5a1.503 1.503 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-.75-1.298M10.875 4.499a1.13 1.13 0 0 1 .694-1.04 1.13 1.13 0 0 1 1.226.244 1.12 1.12 0 0 1 .244 1.226A1.12 1.12 0 0 1 12 5.624a1.123 1.123 0 0 1-1.125-1.125M12 7.124a7.51 7.51 0 0 1 7.5 7.5v1.5h-15v-1.5a7.507 7.507 0 0 1 7.5-7.5m-.75 10.5v3H7.5v-3zm1.5 0h3.75v3h-3.75zm-9 0H6v3H3.75zm16.5 3H18v-3h2.25z" /></Svg>;
export { OutlineBeanie as ReactComponent };
