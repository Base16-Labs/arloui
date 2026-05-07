import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidStool = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.75 6V3.75c0-.4-.159-.78-.44-1.06a1.5 1.5 0 0 0-1.06-.44H6.75c-.399 0-.78.16-1.061.44-.282.28-.44.66-.44 1.06V6c0 .4.159.78.44 1.06s.662.44 1.06.44h.623L5.259 20.88a.754.754 0 0 0 .624.86c.038.01.077.01.117.01.178 0 .35-.06.486-.18a.74.74 0 0 0 .253-.45l.73-4.62h9.06l.73 4.62c.027.17.117.34.253.45.136.12.308.18.488.18.04 0 .078 0 .117-.01a.75.75 0 0 0 .624-.86L16.629 7.5h.622c.398 0 .779-.16 1.06-.44s.44-.66.44-1.06m-2.457 9H7.707L8.89 7.5h6.218z" /></Svg>;
export { SolidStool as ReactComponent };
