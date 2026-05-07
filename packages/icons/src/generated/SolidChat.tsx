import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidChat = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 4.5v12a1.5 1.5 0 0 1-1.5 1.5H7.78l-3.05 2.64h-.01c-.27.23-.62.36-.97.36-.22 0-.44-.05-.64-.15-.26-.11-.47-.31-.63-.55-.15-.24-.23-.52-.23-.8v-15A1.5 1.5 0 0 1 3.75 3h16.5a1.5 1.5 0 0 1 1.5 1.5" /></Svg>;
export { SolidChat as ReactComponent };
