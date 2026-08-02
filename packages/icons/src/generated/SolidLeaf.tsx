import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidLeaf = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.573 3.75a.74.74 0 0 0-.22-.48.74.74 0 0 0-.49-.22c-7.13-.42-12.85 1.73-15.29 5.76a8.16 8.16 0 0 0-1.19 4.59 9.4 9.4 0 0 0 .62 3.02c.02.06.06.11.1.15.05.05.11.08.17.09s.13.01.19-.01.11-.05.16-.1l7.97-8.09a.78.78 0 0 1 .53-.22c.1 0 .19.02.28.06.1.04.18.09.25.16a.82.82 0 0 1 .22.53.821.821 0 0 1-.22.54l-8.71 8.84-1.33 1.33c-.14.13-.22.31-.23.5-.01.2.05.39.17.54.07.07.15.14.25.18.09.05.19.07.29.08q.165 0 .3-.06c.1-.03.19-.09.26-.16l1.57-1.58c1.33.64 2.67.99 3.99 1.04.11 0 .21.01.32.01 1.51 0 2.99-.42 4.28-1.21 4.03-2.43 6.18-8.15 5.76-15.29" /></Svg>;
export { SolidLeaf as ReactComponent };
export { SolidLeaf };
export default SolidLeaf;
