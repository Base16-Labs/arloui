import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTagSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m22.375 11.59-4.28-6.42c-.137-.2-.322-.37-.54-.49-.216-.12-.46-.18-.706-.18H3.001c-.398 0-.78.16-1.061.44S1.5 5.6 1.5 6v12c0 .4.159.78.44 1.06s.663.44 1.06.44h13.85c.245 0 .488-.06.705-.18.218-.11.402-.28.54-.49l4.278-6.41a.75.75 0 0 0 .002-.83M16.849 18H3.001V6H16.85l3.999 6z" /></Svg>;
export { OutlineTagSimple as ReactComponent };
