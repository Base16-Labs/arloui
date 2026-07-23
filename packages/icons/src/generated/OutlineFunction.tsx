import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFunction = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3.75a.75.75 0 0 1-.75.75H16c-.52 0-1.03.19-1.44.52-.4.34-.68.81-.77 1.33l-.89 4.9h4.35a.75.75 0 0 1 0 1.5h-4.62l-.94 5.17a3.72 3.72 0 0 1-1.29 2.21c-.67.56-1.53.87-2.4.87H5.25a.75.75 0 0 1 0-1.5H8c.52 0 1.03-.18 1.44-.52.4-.34.68-.81.77-1.33l.89-4.9H6.75a.75.75 0 0 1 0-1.5h4.62l.94-5.17c.16-.87.61-1.65 1.29-2.21.67-.56 1.53-.87 2.4-.87h2.75a.75.75 0 0 1 .75.75" /></Svg>;
export { OutlineFunction as ReactComponent };
