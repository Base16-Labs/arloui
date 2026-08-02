import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDoor = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 20.25H19.5V3.75a1.5 1.5 0 0 0-1.5-1.5H6a1.5 1.5 0 0 0-1.5 1.5v16.5H2.25a.75.75 0 0 0 0 1.5h19.5a.75.75 0 0 0 0-1.5m-6.37-6.75c-.23 0-.44-.07-.63-.19-.18-.12-.33-.3-.41-.51-.09-.2-.11-.43-.07-.65.05-.21.15-.41.31-.57s.36-.27.58-.31c.21-.04.44-.02.65.06.2.09.38.23.5.42.12.18.19.4.19.62a1.13 1.13 0 0 1-1.12 1.13" /></Svg>;
export { SolidDoor as ReactComponent };
export { SolidDoor };
export default SolidDoor;
