import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCoinVertical = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.61 5.26c-1.131-1.94-2.68-3.01-4.36-3.01h-4.5c-1.68 0-3.229 1.07-4.36 3.01C4.332 7.07 3.75 9.47 3.75 12s.582 4.93 1.64 6.74c1.131 1.94 2.68 3.01 4.36 3.01h4.5c1.68 0 3.229-1.07 4.36-3.01 1.058-1.81 1.64-4.21 1.64-6.74s-.582-4.93-1.64-6.74m.12 5.99h-3a14.3 14.3 0 0 0-.907-4.5h2.868c.573 1.26.952 2.81 1.039 4.5m-1.931-6h-2.693a7.8 7.8 0 0 0-1.125-1.5h1.269c.938 0 1.819.56 2.549 1.5m-2.549 15h-1.267c.434-.45.812-.95 1.125-1.5h2.694c-.733.94-1.614 1.5-2.552 1.5m3.441-3h-2.867c.542-1.44.849-2.96.907-4.5h3c-.088 1.69-.467 3.25-1.04 4.5" /></Svg>;
export { SolidCoinVertical as ReactComponent };
