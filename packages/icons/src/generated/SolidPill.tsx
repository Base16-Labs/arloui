import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPill = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.268 3.735a4.98 4.98 0 0 0-3.531-1.46c-1.324 0-2.595.52-3.531 1.46l-9.516 9.51a5 5 0 0 0 .045 7.02 4.993 4.993 0 0 0 7.017.04l9.516-9.51a5 5 0 0 0 1.46-3.53c0-1.32-.525-2.59-1.46-3.53m-1.061 6-4.758 4.76-4.94-4.94 4.758-4.76c.658-.64 1.542-1 2.462-1a3.52 3.52 0 0 1 2.449 1.03 3.49 3.49 0 0 1 .029 4.91m-1.447-1.99q.105.105.163.24a.75.75 0 0 1-.163.82l-2.25 2.25a.77.77 0 0 1-.53.22.766.766 0 0 1-.53-.22.8.8 0 0 1-.22-.53c0-.1.02-.2.057-.29a.8.8 0 0 1 .163-.24l2.25-2.25a.751.751 0 0 1 1.06 0" /></Svg>;
export { SolidPill as ReactComponent };
