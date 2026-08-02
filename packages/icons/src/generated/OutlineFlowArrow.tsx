import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFlowArrow = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m23.03 6.971-3-3a.751.751 0 0 0-1.061 1.06l1.721 1.72H19.5c-4.625 0-5.723 2.64-6.692 4.96-.879 2.11-1.586 3.81-4.639 4.02a3.72 3.72 0 0 0-1.465-2.26 3.73 3.73 0 0 0-2.604-.7c-.924.1-1.778.54-2.397 1.23-.619.7-.959 1.6-.953 2.52.006.93.357 1.83.984 2.51a3.7 3.7 0 0 0 2.412 1.2 3.76 3.76 0 0 0 2.595-.72 3.77 3.77 0 0 0 1.438-2.28c4.055-.25 5.094-2.73 6.013-4.94.94-2.26 1.683-4.04 5.308-4.04h1.19l-1.721 1.72a.75.75 0 0 0 0 1.06.751.751 0 0 0 1.061 0l3-3c.07-.07.13-.15.16-.24a.72.72 0 0 0 0-.58.6.6 0 0 0-.16-.24M4.5 18.751c-.445 0-.88-.13-1.25-.38s-.658-.6-.829-1.01-.214-.86-.128-1.3c.087-.43.301-.84.616-1.15.315-.32.716-.53 1.152-.62a2.251 2.251 0 1 1 .439 4.46" /></Svg>;
export { OutlineFlowArrow as ReactComponent };
export { OutlineFlowArrow };
export default OutlineFlowArrow;
