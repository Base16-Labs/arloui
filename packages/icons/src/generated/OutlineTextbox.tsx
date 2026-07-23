import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTextbox = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M10.5 3.75a.75.75 0 0 0-.75.75V6h-7.5a1.5 1.5 0 0 0-1.5 1.5v9a1.5 1.5 0 0 0 1.5 1.5h7.5v1.5a.75.75 0 0 0 1.5 0v-15a.75.75 0 0 0-.75-.75M2.25 16.5v-9h7.5v9zm21-9v9a1.5 1.5 0 0 1-1.5 1.5H13.5a.75.75 0 0 1 0-1.5h8.25v-9H13.5a.75.75 0 0 1 0-1.5h8.25a1.5 1.5 0 0 1 1.5 1.5m-15 3a.75.75 0 0 1-.75.75h-.75v2.25a.75.75 0 0 1-1.5 0v-2.25H4.5a.75.75 0 0 1 0-1.5h3a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineTextbox as ReactComponent };
