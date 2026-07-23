import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePerspective = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 11.24H21V4.49c0-.22-.048-.44-.141-.64-.094-.2-.229-.37-.398-.52a1.4 1.4 0 0 0-.578-.29 1.4 1.4 0 0 0-.651-.03l-15 2.73A1.496 1.496 0 0 0 3 7.21v4.03H1.5a.751.751 0 0 0 0 1.5H3v4.02a1.496 1.496 0 0 0 1.232 1.47l15 2.73q.133.03.268.03c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06v-6.75h1.5a.751.751 0 0 0 0-1.5m-18-4.03 15-2.72v6.75h-15zm15 12.28-15-2.73v-4.02h15z" /></Svg>;
export { OutlinePerspective as ReactComponent };
