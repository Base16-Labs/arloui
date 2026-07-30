import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidDoorOpen = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 20.25H19.5V3.75c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 18 2.25H6c-.398 0-.78.16-1.06.44-.282.28-.44.66-.44 1.06v16.5H2.25a.753.753 0 0 0-.75.75.753.753 0 0 0 .75.75h19.5a.751.751 0 0 0 0-1.5m-6 0H6V3.75h9.75zM12 12.37c0-.22.066-.44.19-.62.123-.19.299-.33.504-.42a1.2 1.2 0 0 1 .65-.06c.219.04.419.15.576.31a1.107 1.107 0 0 1 .244 1.22c-.085.21-.229.39-.414.51s-.402.19-.625.19A1.127 1.127 0 0 1 12 12.37" /></Svg>;
export { SolidDoorOpen as ReactComponent };
