import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCrosshairSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M16.5 12.75h2.21a6.8 6.8 0 0 1-1.94 4.02 6.76 6.76 0 0 1-4.02 1.94V16.5a.75.75 0 0 0-1.5 0v2.21a6.76 6.76 0 0 1-4.02-1.94 6.8 6.8 0 0 1-1.94-4.02H7.5a.75.75 0 0 0 0-1.5H5.29c.18-1.52.86-2.94 1.94-4.02a6.75 6.75 0 0 1 4.02-1.93v2.2a.75.75 0 0 0 1.5 0V5.3c1.52.17 2.94.85 4.02 1.93a6.8 6.8 0 0 1 1.94 4.02H16.5a.75.75 0 0 0 0 1.5m5.25-.75c0 1.93-.57 3.82-1.64 5.42a9.8 9.8 0 0 1-4.38 3.59c-1.78.74-3.74.93-5.63.55a9.7 9.7 0 0 1-4.99-2.66 9.68 9.68 0 0 1-2.67-5c-.38-1.89-.19-3.85.55-5.63A9.77 9.77 0 0 1 6.58 3.9a9.733 9.733 0 0 1 12.31 1.21A9.75 9.75 0 0 1 21.75 12m-1.5 0a8.255 8.255 0 0 0-5.09-7.62 8.3 8.3 0 0 0-4.77-.47c-1.6.32-3.07 1.1-4.22 2.26a8.2 8.2 0 0 0-2.26 4.22c-.32 1.6-.16 3.26.47 4.77a8.15 8.15 0 0 0 3.04 3.7c1.35.91 2.95 1.39 4.58 1.39 2.19 0 4.28-.87 5.83-2.42A8.22 8.22 0 0 0 20.25 12" /></Svg>;
export { SolidCrosshairSimple as ReactComponent };
export { SolidCrosshairSimple };
export default SolidCrosshairSimple;
