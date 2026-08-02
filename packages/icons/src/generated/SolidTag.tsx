import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTag = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m21.685 11.625-9.31-9.31a1.4 1.4 0 0 0-.486-.32 1.4 1.4 0 0 0-.574-.12h-8.69a.75.75 0 0 0-.75.75v8.69c-.001.2.038.39.113.58q.115.27.327.48l9.31 9.31c.139.14.305.25.487.33.182.07.377.11.574.11s.392-.04.574-.11q.275-.12.487-.33l7.938-7.94q.211-.21.326-.48a1.52 1.52 0 0 0 0-1.15 1.6 1.6 0 0 0-.326-.49M6.75 7.875c-.222 0-.44-.06-.625-.19a1.115 1.115 0 0 1-.478-1.15c.043-.22.15-.42.308-.58.157-.16.357-.26.576-.31.218-.04.444-.02.65.07a1.11 1.11 0 0 1 .694 1.04c0 .3-.119.58-.329.79s-.498.33-.796.33" /></Svg>;
export { SolidTag as ReactComponent };
export { SolidTag };
export default SolidTag;
