import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNotches = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.878 4.877v14.25c0 .2-.08.39-.22.53-.15.14-.34.22-.53.22H4.878a.77.77 0 0 1-.7-.47.7.7 0 0 1-.04-.43c.03-.15.1-.28.2-.38l14.25-14.25q.165-.165.39-.21c.14-.03.3-.01.43.04a.771.771 0 0 1 .47.7" /></Svg>;
export { SolidNotches as ReactComponent };
