import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidEye = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M23.19 11.7c-.04-.07-.83-1.83-2.6-3.6-2.35-2.35-5.32-3.6-8.59-3.6S5.76 5.75 3.41 8.1C1.64 9.87.84 11.63.81 11.7a.82.82 0 0 0 0 .61c.04.07.83 1.84 2.6 3.6C5.76 18.26 8.73 19.5 12 19.5s6.24-1.24 8.59-3.59c1.77-1.76 2.56-3.53 2.6-3.6a.8.8 0 0 0 0-.61M12 15.75c-.74 0-1.47-.22-2.08-.63a3.66 3.66 0 0 1-1.38-1.68c-.29-.69-.36-1.44-.22-2.17.15-.72.5-1.39 1.03-1.92a3.7 3.7 0 0 1 1.92-1.02 3.75 3.75 0 0 1 2.17.21c.68.28 1.27.76 1.68 1.38s.63 1.34.63 2.08c0 1-.4 1.95-1.1 2.66-.7.7-1.66 1.09-2.65 1.09" /></Svg>;
export { SolidEye as ReactComponent };
