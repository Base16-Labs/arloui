import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFunction = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3m-3 3.75h-1.51c-.35 0-.69.12-.95.34-.27.23-.46.54-.52.88l-.62 3.28h2.85a.75.75 0 0 1 0 1.5h-3.13l-.66 3.55c-.13.69-.5 1.31-1.04 1.76s-1.21.69-1.91.69H7.5a.75.75 0 0 1 0-1.5h1.51c.35 0 .69-.12.95-.34.27-.23.46-.54.52-.88l.62-3.28H8.25a.75.75 0 0 1 0-1.5h3.13l.66-3.55c.13-.69.5-1.31 1.04-1.76.54-.44 1.21-.69 1.91-.69h1.51a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidFunction as ReactComponent };
