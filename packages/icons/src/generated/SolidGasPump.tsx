import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidGasPump = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m21.844 6.53-1.813-1.81a.755.755 0 0 0-1.062 0 .75.75 0 0 0 0 1.06l1.812 1.82c.14.14.218.33.219.52v7.63a.751.751 0 0 1-1.5 0V12a2.256 2.256 0 0 0-2.25-2.25h-1.5v-4.5A2.256 2.256 0 0 0 13.5 3H6a2.256 2.256 0 0 0-2.25 2.25V19.5h-1.5a.751.751 0 0 0 0 1.5h15a.751.751 0 0 0 0-1.5h-1.5v-8.25h1.5A.75.75 0 0 1 18 12v3.75c0 .6.237 1.17.659 1.59.422.43.994.66 1.591.66s1.169-.23 1.591-.66c.422-.42.659-.99.659-1.59V8.12c.001-.29-.056-.58-.169-.86a2.3 2.3 0 0 0-.487-.73m-9.094 4.72h-6a.751.751 0 0 1 0-1.5h6a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidGasPump as ReactComponent };
