import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDiceTwo = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18 3H6c-.79 0-1.56.32-2.12.88S3 5.2 3 6v12c0 .79.32 1.56.88 2.12S5.21 21 6 21h12c.8 0 1.56-.32 2.12-.88S21 18.79 21 18V6c0-.8-.32-1.56-.88-2.12S18.8 3 18 3m-7.87 8.25c-.23 0-.44-.07-.63-.19-.18-.12-.33-.3-.41-.51-.09-.2-.11-.43-.07-.65.05-.21.15-.41.31-.57s.36-.27.58-.31c.21-.04.44-.02.65.06.2.09.38.23.5.42.12.18.19.4.19.62a1.13 1.13 0 0 1-1.12 1.13M13.88 15c-.23 0-.44-.07-.63-.19-.18-.12-.33-.3-.41-.51-.09-.2-.11-.43-.07-.65.05-.21.15-.41.31-.57s.36-.27.58-.31c.21-.04.44-.02.65.06.2.09.38.23.5.42.12.18.19.4.19.62A1.13 1.13 0 0 1 13.88 15" /></Svg>;
export { SolidDiceTwo as ReactComponent };
export { SolidDiceTwo };
export default SolidDiceTwo;
