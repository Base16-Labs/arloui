import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineDiamond = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m22.058 10.94-9.004-9a1.5 1.5 0 0 0-1.059-.44 1.5 1.5 0 0 0-1.056.44l-9 9c-.28.28-.437.66-.437 1.06s.157.78.436 1.06l9.005 9A1.5 1.5 0 0 0 12 22.5a1.5 1.5 0 0 0 1.056-.44l9.006-9c.279-.28.436-.66.436-1.06s-.157-.78-.436-1.06zM11.996 21l-9-9 9-9 9 9z" /></Svg>;
export { OutlineDiamond as ReactComponent };
