import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePlayPause = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M17.25 6v12a.751.751 0 0 1-1.5 0V6a.751.751 0 0 1 1.5 0M21 5.25a.75.75 0 0 0-.75.75v12a.751.751 0 0 0 1.5 0V6a.751.751 0 0 0-.75-.75M13.5 12c0 .25-.062.49-.183.71-.12.22-.293.41-.504.54l-8.268 5.26c-.225.15-.484.23-.751.24s-.532-.06-.766-.18a1.5 1.5 0 0 1-.778-1.31V6.73a1.505 1.505 0 0 1 .778-1.3c.234-.13.499-.19.766-.18s.526.09.751.23l8.268 5.27c.211.13.384.32.504.53.121.22.183.47.183.72m-1.517 0L3.75 6.76v10.48z" /></Svg>;
export { OutlinePlayPause as ReactComponent };
export { OutlinePlayPause };
export default OutlinePlayPause;
