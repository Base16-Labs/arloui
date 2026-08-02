import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFlipHorizontal = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M11.25 4.5v15c0 .4-.158.78-.44 1.06-.281.28-.662.44-1.06.44h-6c-.247 0-.49-.06-.708-.18a1.4 1.4 0 0 1-.541-.49c-.137-.2-.221-.44-.245-.68-.024-.25.013-.5.108-.73l6-14.99.006-.01a1.494 1.494 0 0 1 1.678-.88c.338.06.642.25.862.51.219.27.339.61.34.95M21.5 20.33c-.137.21-.323.38-.541.49-.218.12-.462.18-.71.18h-6c-.397 0-.778-.16-1.06-.44a1.5 1.5 0 0 1-.44-1.06v-15a1.5 1.5 0 0 1 1.203-1.47 1.5 1.5 0 0 1 .998.14c.306.17.547.43.682.75l.005.01 6 14.99a1.5 1.5 0 0 1-.137 1.41m-1.25-.83-.006-.01L14.25 4.5v15z" /></Svg>;
export { SolidFlipHorizontal as ReactComponent };
export { SolidFlipHorizontal };
export default SolidFlipHorizontal;
