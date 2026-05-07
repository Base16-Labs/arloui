import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineAlignBottom = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 20.625a.753.753 0 0 1-.75.75H3.75a.753.753 0 0 1-.53-1.28c.14-.141.33-.22.53-.22h16.5a.753.753 0 0 1 .75.75m-8.25-3.75v-9c0-.398.16-.78.44-1.06.28-.282.66-.44 1.06-.44H18a1.506 1.506 0 0 1 1.5 1.5v9c0 .398-.16.78-.44 1.06-.28.282-.66.44-1.06.44h-3.75a1.506 1.506 0 0 1-1.5-1.5m1.5 0H18v-9h-3.75zm-9.75 0V4.125c0-.398.16-.78.44-1.06.28-.282.66-.44 1.06-.44h3.75a1.506 1.506 0 0 1 1.5 1.5v12.75c0 .398-.16.78-.44 1.06-.28.282-.66.44-1.06.44H6a1.506 1.506 0 0 1-1.5-1.5m1.5 0h3.75V4.125H6z" /></Svg>;
export { OutlineAlignBottom as ReactComponent };
