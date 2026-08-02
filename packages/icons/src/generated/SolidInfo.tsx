import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidInfo = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.253a9.76 9.76 0 0 0-5.417 1.64 9.74 9.74 0 0 0-4.146 10.01 9.74 9.74 0 0 0 2.67 4.99 9.8 9.8 0 0 0 4.991 2.67c1.891.37 3.852.18 5.633-.56a9.66 9.66 0 0 0 4.376-3.59 9.74 9.74 0 0 0-1.216-12.31 9.77 9.77 0 0 0-6.89-2.85m-.375 4.5c.223 0 .44.06.625.19a1.115 1.115 0 0 1 .478 1.15c-.043.22-.15.42-.308.58-.157.15-.357.26-.576.3-.218.05-.444.03-.65-.06a1.11 1.11 0 0 1-.694-1.04c0-.3.12-.58.33-.79.21-.22.497-.33.795-.33m1.125 10.5c-.398 0-.779-.16-1.06-.44a1.5 1.5 0 0 1-.44-1.06v-3.75a.751.751 0 0 1 0-1.5c.398 0 .78.15 1.061.44.281.28.44.66.44 1.06v3.75c.198 0 .39.07.53.22a.745.745 0 0 1 0 1.06.75.75 0 0 1-.53.22" /></Svg>;
export { SolidInfo as ReactComponent };
export { SolidInfo };
export default SolidInfo;
