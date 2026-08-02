import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidControl = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.443 15.665a.8.8 0 0 1-.276.34.77.77 0 0 1-.417.12H5.25a.77.77 0 0 1-.417-.12.8.8 0 0 1-.276-.34.74.74 0 0 1-.043-.43.77.77 0 0 1 .205-.39l6.75-6.75a.78.78 0 0 1 .531-.22.782.782 0 0 1 .531.22l6.75 6.75a.77.77 0 0 1 .205.39c.029.14.014.29-.043.43" /></Svg>;
export { SolidControl as ReactComponent };
export { SolidControl };
export default SolidControl;
