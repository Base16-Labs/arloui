import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineGps = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 11.25h-2.28a8.24 8.24 0 0 0-2.39-5.08 8.24 8.24 0 0 0-5.08-2.39V1.5c0-.2-.08-.39-.22-.53A.7.7 0 0 0 12 .75c-.2 0-.39.07-.53.22a.75.75 0 0 0-.22.53v2.28a8.26 8.26 0 0 0-7.46 7.47H1.5c-.2 0-.39.07-.53.22a.75.75 0 0 0 .53 1.28h2.29a8.3 8.3 0 0 0 2.38 5.08 8.3 8.3 0 0 0 5.08 2.38v2.29a.75.75 0 1 0 1.5 0v-2.29a8.26 8.26 0 0 0 7.47-7.46h2.28a.75.75 0 0 0 .53-1.28.7.7 0 0 0-.53-.22M12 18.75a6.742 6.742 0 0 1-6.23-4.17 6.76 6.76 0 0 1-.39-3.9c.26-1.31.91-2.51 1.85-3.46.94-.94 2.15-1.58 3.46-1.84s2.66-.13 3.9.38c1.23.51 2.28 1.38 3.03 2.49A6.74 6.74 0 0 1 18.75 12c0 1.79-.71 3.5-1.98 4.77A6.8 6.8 0 0 1 12 18.75" /></Svg>;
export { OutlineGps as ReactComponent };
export { OutlineGps };
export default OutlineGps;
