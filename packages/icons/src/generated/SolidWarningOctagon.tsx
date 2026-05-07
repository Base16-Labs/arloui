import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWarningOctagon = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m21.31 7.52-4.83-4.83c-.28-.28-.66-.44-1.06-.44H8.58c-.4 0-.78.16-1.06.44L2.69 7.52c-.28.28-.44.67-.44 1.06v6.84c0 .4.16.78.44 1.06l4.83 4.83c.28.28.66.44 1.06.44h6.84c.4 0 .78-.16 1.06-.44l4.83-4.83c.28-.28.44-.66.44-1.06V8.58c0-.39-.16-.78-.44-1.06M11.25 7.5a.75.75 0 0 1 1.5 0v5.25a.75.75 0 0 1-1.5 0zm.75 9.75c-.22 0-.44-.07-.63-.19-.18-.12-.32-.3-.41-.5-.08-.21-.11-.44-.06-.65.04-.22.15-.42.3-.58.16-.16.36-.26.58-.31.22-.04.44-.02.65.07.21.08.38.23.51.41q.18.285.18.63c0 .29-.11.58-.32.79-.22.21-.5.33-.8.33" /></Svg>;
export { SolidWarningOctagon as ReactComponent };
