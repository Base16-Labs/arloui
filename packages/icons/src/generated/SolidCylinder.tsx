import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCylinder = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 1.5c-3.785 0-6.75 1.81-6.75 4.13v12.75c0 2.31 2.965 4.12 6.75 4.12s6.75-1.81 6.75-4.12V5.63c0-2.32-2.965-4.13-6.75-4.13M12 21c-2.796 0-5.25-1.22-5.25-2.62V7.26C7.774 8.3 9.741 9 12 9s4.226-.7 5.25-1.74v11.12c0 1.4-2.453 2.62-5.25 2.62" /></Svg>;
export { SolidCylinder as ReactComponent };
