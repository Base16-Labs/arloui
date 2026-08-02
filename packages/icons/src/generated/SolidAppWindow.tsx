import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidAppWindow = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.4 0-.78.158-1.06.439s-.44.663-.44 1.061v13.5c0 .398.16.779.44 1.061s.66.439 1.06.439h16.5c.4 0 .78-.158 1.06-.439s.44-.663.44-1.061V5.25c0-.398-.16-.779-.44-1.061a1.5 1.5 0 0 0-1.06-.439M6.38 9a1.112 1.112 0 0 1-1.04-.694 1.1 1.1 0 0 1-.07-.65c.05-.219.15-.419.31-.576a1.13 1.13 0 0 1 1.23-.244c.2.085.38.229.5.414A1.127 1.127 0 0 1 6.38 9m3.75 0a1.112 1.112 0 0 1-1.04-.694 1.1 1.1 0 0 1-.07-.65c.05-.219.15-.419.31-.576a1.13 1.13 0 0 1 1.23-.244c.2.085.38.229.5.414A1.127 1.127 0 0 1 10.13 9" /></Svg>;
export { SolidAppWindow as ReactComponent };
export { SolidAppWindow };
export default SolidAppWindow;
