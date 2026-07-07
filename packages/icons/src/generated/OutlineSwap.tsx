import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSwap = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 4.5v9.75a1.5 1.5 0 0 1-1.5 1.5H9.31l.97.97c.07.07.13.15.16.24a.717.717 0 0 1 0 .58c-.03.09-.09.17-.16.24s-.15.13-.24.16a.72.72 0 0 1-.58 0 .6.6 0 0 1-.24-.16l-2.25-2.25a.6.6 0 0 1-.16-.24.72.72 0 0 1 0-.58c.03-.09.09-.17.16-.24l2.25-2.25a.75.75 0 1 1 1.06 1.06l-.97.97H19.5V4.5H9v.75a.75.75 0 0 1-1.5 0V4.5A1.5 1.5 0 0 1 9 3h10.5A1.5 1.5 0 0 1 21 4.5M15.75 18a.75.75 0 0 0-.75.75v.75H4.5V9.75h10.19l-.97.97a.75.75 0 1 0 1.06 1.06l2.25-2.25c.07-.07.13-.15.16-.24a.72.72 0 0 0 0-.58.6.6 0 0 0-.16-.24l-2.25-2.25a.75.75 0 1 0-1.06 1.06l.97.97H4.5A1.5 1.5 0 0 0 3 9.75v9.75A1.5 1.5 0 0 0 4.5 21H15a1.5 1.5 0 0 0 1.5-1.5v-.75a.75.75 0 0 0-.75-.75" /></Svg>;
export { OutlineSwap as ReactComponent };
