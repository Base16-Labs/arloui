import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPlayPause = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M17.25 6v12a.751.751 0 0 1-1.5 0V6a.751.751 0 0 1 1.5 0M21 5.25a.75.75 0 0 0-.75.75v12a.751.751 0 0 0 1.5 0V6a.751.751 0 0 0-.75-.75m-8.187 5.5L4.545 5.48a1.53 1.53 0 0 0-.751-.23c-.267-.01-.532.05-.766.18a1.5 1.5 0 0 0-.778 1.3v10.53c.001.27.073.53.208.76a1.49 1.49 0 0 0 1.332.72c.268 0 .529-.08.755-.23l8.268-5.26c.21-.14.384-.32.504-.54s.183-.46.183-.71-.063-.5-.183-.72-.294-.4-.504-.53" /></Svg>;
export { SolidPlayPause as ReactComponent };
