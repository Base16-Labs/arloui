import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTrash = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 5.25H16.5V4.5c0-.59-.237-1.17-.659-1.59a2.26 2.26 0 0 0-1.591-.66h-4.5a2.26 2.26 0 0 0-1.591.66c-.422.42-.659 1-.659 1.59v.75H3.75A.753.753 0 0 0 3 6a.753.753 0 0 0 .75.75h.75v13.5a1.506 1.506 0 0 0 1.5 1.5h12c.398 0 .78-.16 1.06-.44.282-.28.44-.66.44-1.06V6.75h.75A.753.753 0 0 0 21 6a.753.753 0 0 0-.75-.75M9 4.5a.753.753 0 0 1 .75-.75h4.5a.753.753 0 0 1 .75.75v.75H9zm9 15.75H6V6.75h12zm-7.5-9.75v6a.753.753 0 0 1-1.28.53.75.75 0 0 1-.22-.53v-6a.753.753 0 0 1 1.28-.53c.141.14.22.33.22.53m4.5 0v6a.753.753 0 0 1-1.28.53.75.75 0 0 1-.22-.53v-6a.753.753 0 0 1 1.28-.53c.141.14.22.33.22.53" /></Svg>;
export { OutlineTrash as ReactComponent };
export { OutlineTrash };
export default OutlineTrash;
