import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineQuestionMark = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18 8.625c0 2.67-2.294 4.88-5.25 5.21v.79a.751.751 0 0 1-1.5 0v-1.5a.751.751 0 0 1 .75-.75c2.482 0 4.5-1.68 4.5-3.75s-2.018-3.75-4.5-3.75-4.5 1.68-4.5 3.75a.751.751 0 0 1-1.5 0c0-2.9 2.692-5.25 6-5.25s6 2.35 6 5.25m-6 9c-.297 0-.587.09-.833.25-.247.17-.439.4-.553.67a1.516 1.516 0 0 0 .325 1.64c.21.21.477.35.768.41s.593.03.867-.09c.274-.11.508-.3.673-.55s.253-.54.253-.83c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44" /></Svg>;
export { OutlineQuestionMark as ReactComponent };
export { OutlineQuestionMark };
export default OutlineQuestionMark;
