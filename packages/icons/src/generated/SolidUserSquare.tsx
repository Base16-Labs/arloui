import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidUserSquare = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M16.12 11.25a4.11 4.11 0 0 1-2.54 3.81 4.117 4.117 0 0 1-4.5-.89 4.12 4.12 0 0 1-.89-4.5A4.11 4.11 0 0 1 12 7.13a4.117 4.117 0 0 1 4.12 4.12M21 4.5v15a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 19.5v-15A1.5 1.5 0 0 1 4.5 3h15A1.499 1.499 0 0 1 21 4.5m-1.5 15v-15h-15v15h.34a7.55 7.55 0 0 1 2.45-3.58c.19-.16.39-.3.59-.44.07-.04.15-.06.23-.06.08.01.16.04.22.09 1.02.88 2.32 1.37 3.67 1.37 1.34 0 2.64-.49 3.66-1.37a.43.43 0 0 1 .22-.09c.08 0 .16.02.23.06.21.14.41.28.6.44 1.15.93 2 2.17 2.44 3.58z" /></Svg>;
export { SolidUserSquare as ReactComponent };
