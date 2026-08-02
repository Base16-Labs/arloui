import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineEnvelopeSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 4.5H3c-.199 0-.39.08-.53.22a.78.78 0 0 0-.22.53V18c0 .4.158.78.439 1.07.282.28.663.43 1.061.43h16.5c.398 0 .779-.15 1.061-.43.281-.29.439-.67.439-1.07V5.25c0-.19-.079-.38-.22-.53A.75.75 0 0 0 21 4.5M19.072 6 12 12.49 4.928 6zm1.178 12H3.75V6.96l7.743 7.1c.138.13.319.2.507.2s.369-.07.507-.2l7.743-7.1z" /></Svg>;
export { OutlineEnvelopeSimple as ReactComponent };
export { OutlineEnvelopeSimple };
export default OutlineEnvelopeSimple;
