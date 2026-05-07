import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineScales = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m22.45 12.47-3-7.5a.757.757 0 0 0-.86-.46l-5.84 1.3V3.75a.75.75 0 0 0-1.5 0v2.4L5.09 7.52c-.12.02-.23.08-.33.16-.09.07-.16.17-.21.29l-3 7.5c-.03.09-.05.18-.05.28 0 2.18 2.3 3 3.75 3s3.75-.82 3.75-3c0-.1-.02-.19-.05-.28L6.27 8.79l4.98-1.1V19.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5V7.35l4.78-1.06-2.48 6.18c-.03.09-.05.18-.05.28 0 2.18 2.3 3 3.75 3s3.75-.82 3.75-3c0-.1-.02-.19-.05-.28m-17.2 4.78c-.71 0-2.13-.34-2.24-1.37l2.24-5.61 2.24 5.61c-.11 1.03-1.53 1.37-2.24 1.37m13.5-3c-.71 0-2.13-.34-2.24-1.37l2.24-5.61 2.24 5.61c-.11 1.03-1.53 1.37-2.24 1.37" /></Svg>;
export { OutlineScales as ReactComponent };
