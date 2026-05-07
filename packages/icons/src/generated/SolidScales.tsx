import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidScales = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m22.45 12.47-3-7.5a.8.8 0 0 0-.28-.34.7.7 0 0 0-.58-.11l-5.84 1.29V3.75a.75.75 0 0 0-1.5 0v2.4L5.09 7.52c-.12.02-.23.08-.32.16-.1.07-.17.17-.22.29l-3 7.5c-.03.09-.05.18-.05.28 0 2.18 2.3 3 3.75 3s3.75-.82 3.75-3c0-.1-.02-.19-.05-.28L6.27 8.79l4.98-1.1V19.5h-1.5a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5h-1.5V7.35l4.78-1.06-2.48 6.18c-.03.09-.05.18-.05.28 0 2.18 2.3 3 3.75 3s3.75-.82 3.75-3c0-.1-.02-.19-.05-.28m-15 3.28H3.06l2.19-5.48zm9.11-3 2.19-5.48 2.19 5.48z" /></Svg>;
export { SolidScales as ReactComponent };
