import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidHouse = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 11.625v9a.751.751 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75v-4.88a.376.376 0 0 0-.375-.37h-3.75a.375.375 0 0 0-.375.37v4.88a.751.751 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-9c0-.4.158-.78.44-1.06l7.5-7.5c.281-.29.662-.44 1.06-.44s.779.15 1.06.44l7.5 7.5c.282.28.44.66.44 1.06" /></Svg>;
export { SolidHouse as ReactComponent };
