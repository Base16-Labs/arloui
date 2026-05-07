import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineUniteSquare = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21 14.25V9a.75.75 0 0 0-.75-.75h-4.5v-4.5A.75.75 0 0 0 15 3H3.75a.75.75 0 0 0-.75.75V15a.75.75 0 0 0 .75.75h4.5v4.5A.75.75 0 0 0 9 21h11.25a.75.75 0 0 0 .75-.75zm-6.44 5.25L4.5 9.44V5.56L18.44 19.5zm-9-15h3.88L19.5 14.56v3.88zm13.94 7.94-2.69-2.69h2.69zm-5.25-5.25L11.56 4.5h2.69zM4.5 11.56l2.69 2.69H4.5zm5.25 5.25 2.69 2.69H9.75z" /></Svg>;
export { OutlineUniteSquare as ReactComponent };
