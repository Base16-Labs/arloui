import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineDoor = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 20.25H19.5V3.75a1.5 1.5 0 0 0-1.5-1.5H6a1.5 1.5 0 0 0-1.5 1.5v16.5H2.25a.75.75 0 0 0 0 1.5h19.5a.75.75 0 0 0 0-1.5M6 3.75h12v16.5H6zm9.75 8.62c0 .23-.07.44-.19.63-.12.18-.3.33-.5.41-.21.09-.44.11-.65.07-.22-.05-.42-.15-.58-.31s-.26-.36-.31-.58c-.04-.21-.02-.44.07-.65.08-.2.23-.38.41-.5.19-.12.4-.19.63-.19a1.13 1.13 0 0 1 1.12 1.12" /></Svg>;
export { OutlineDoor as ReactComponent };
