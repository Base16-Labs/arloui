import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineImageSquare = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15c-.398 0-.78.15-1.06.44C3.157 3.72 3 4.1 3 4.5v15A1.506 1.506 0 0 0 4.5 21h15c.398 0 .78-.16 1.06-.44.282-.28.44-.67.44-1.06v-15c0-.4-.158-.78-.44-1.06A1.47 1.47 0 0 0 19.5 3m-15 1.5h15v7.25l-2.315-2.32a1.5 1.5 0 0 0-1.06-.43c-.398 0-.779.15-1.06.43L5.003 19.5H4.5zm15 15H7.125l9-9 3.375 3.37zM9 11.25c.445 0 .88-.14 1.25-.38a2.255 2.255 0 0 0 .957-2.31 2.3 2.3 0 0 0-.616-1.16 2.3 2.3 0 0 0-1.152-.61A2.25 2.25 0 1 0 9 11.25m0-3c.148 0 .293.04.417.12.123.08.22.2.276.34s.072.29.043.43a.77.77 0 0 1-.206.39.8.8 0 0 1-.384.2.736.736 0 0 1-.77-.32.74.74 0 0 1 .094-.94c.14-.15.331-.22.53-.22" /></Svg>;
export { OutlineImageSquare as ReactComponent };
