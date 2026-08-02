import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBoat = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.73 10.369 19.5 9.96V5.252c0-.397-.15-.78-.43-1.06A1.53 1.53 0 0 0 18 3.75h-5.25v-1.5c0-.198-.07-.39-.22-.53a.75.75 0 0 0-1.06 0 .76.76 0 0 0-.22.53v1.5H6c-.39 0-.77.159-1.06.44-.28.28-.44.663-.44 1.06v4.71l-1.22.407c-.3.1-.56.291-.74.547a1.47 1.47 0 0 0-.29.877v2.46c0 5.771 9.18 8.132 9.57 8.231.12.02.25.02.37 0 .39-.1 9.56-2.46 9.56-8.231v-2.46c0-.315-.09-.621-.28-.877a1.48 1.48 0 0 0-.74-.546M6 5.251h12V9.46L12.24 7.54a.74.74 0 0 0-.47 0L6 9.46zm14.25 9c0 2.335-2.22 4.03-4.08 5.042-1.32.71-2.72 1.27-4.17 1.68-1.43-.41-2.82-.96-4.14-1.66-3.39-1.843-4.11-3.77-4.11-5.062v-2.46l7.5-2.5v6.46a.755.755 0 0 0 .75.75c.2 0 .39-.08.53-.22a.71.71 0 0 0 .22-.53v-6.46l7.5 2.5z" /></Svg>;
export { OutlineBoat as ReactComponent };
export { OutlineBoat };
export default OutlineBoat;
