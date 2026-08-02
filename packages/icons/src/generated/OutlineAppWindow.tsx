import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineAppWindow = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.4 0-.78.158-1.06.439s-.44.663-.44 1.061v13.5c0 .398.16.779.44 1.061s.66.439 1.06.439h16.5c.4 0 .78-.158 1.06-.439s.44-.663.44-1.061V5.25c0-.398-.16-.779-.44-1.061a1.5 1.5 0 0 0-1.06-.439m0 15H3.75V5.25h16.5zM7.5 7.875c0 .223-.06.44-.19.625a1.115 1.115 0 0 1-1.15.478c-.22-.043-.42-.15-.58-.308a1.15 1.15 0 0 1-.31-.576c-.04-.218-.02-.444.07-.65a1.11 1.11 0 0 1 1.04-.694A1.126 1.126 0 0 1 7.5 7.875m3.75 0c0 .223-.06.44-.19.625a1.115 1.115 0 0 1-1.15.478c-.22-.043-.42-.15-.58-.308a1.15 1.15 0 0 1-.31-.576c-.04-.218-.02-.444.07-.65a1.11 1.11 0 0 1 1.04-.694 1.126 1.126 0 0 1 1.12 1.125" /></Svg>;
export { OutlineAppWindow as ReactComponent };
export { OutlineAppWindow };
export default OutlineAppWindow;
