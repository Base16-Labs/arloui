import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBeanie = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 16.326v-1.702a9.014 9.014 0 0 0-6.782-8.719 2.63 2.63 0 0 0 .082-2.67A2.63 2.63 0 0 0 12 1.876a2.633 2.633 0 0 0-2.3 1.359 2.634 2.634 0 0 0 .082 2.67A9.014 9.014 0 0 0 3 14.624v1.702a1.5 1.5 0 0 0-.75 1.298v3a1.503 1.503 0 0 0 1.5 1.5h16.5a1.503 1.503 0 0 0 1.5-1.5v-3a1.5 1.5 0 0 0-.75-1.298m-9.75 1.298v3H7.5v-3zm1.5 0h3.75v3h-3.75zM10.875 4.499a1.12 1.12 0 0 1 .694-1.039c.206-.086.432-.108.65-.064a1.12 1.12 0 0 1 .884.883c.044.219.022.445-.064.65A1.12 1.12 0 0 1 12 5.624a1.123 1.123 0 0 1-1.125-1.125M3.75 17.624H6v3H3.75zm16.5 3H18v-3h2.25z" /></Svg>;
export { SolidBeanie as ReactComponent };
