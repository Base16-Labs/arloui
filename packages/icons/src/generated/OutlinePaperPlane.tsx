import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePaperPlane = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m22.303 19.135-9.002-15.75c-.13-.23-.32-.42-.55-.56a1.54 1.54 0 0 0-1.514 0c-.23.14-.42.33-.55.56l-8.99 15.75c-.149.27-.214.57-.185.88a1.49 1.49 0 0 0 1.098 1.3c.294.08.605.07.893-.03l8.5-2.87 8.5 2.87a1.442 1.442 0 0 0 1.25-.12c.22-.13.41-.31.54-.54s.2-.49.2-.75c.01-.26-.06-.52-.19-.74m-1.31.73-8.24-2.78v-5.46a.751.751 0 0 0-1.5 0v5.46l-8.235 2.78-.015.01 8.987-15.75 9.013 15.75z" /></Svg>;
export { OutlinePaperPlane as ReactComponent };
