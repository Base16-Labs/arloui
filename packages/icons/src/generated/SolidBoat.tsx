import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBoat = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.73 10.369 19.5 9.96V5.252c0-.397-.15-.78-.43-1.06A1.53 1.53 0 0 0 18 3.75h-5.25v-1.5c0-.198-.07-.39-.22-.53a.75.75 0 0 0-1.06 0 .76.76 0 0 0-.22.53v1.5H6c-.39 0-.77.159-1.06.44-.28.28-.44.663-.44 1.06v4.71l-1.22.407c-.3.1-.56.291-.74.547a1.47 1.47 0 0 0-.29.877v2.46c0 5.771 9.18 8.132 9.57 8.231.12.02.25.02.37 0 .39-.1 9.56-2.46 9.56-8.231v-2.46c0-.315-.09-.621-.28-.877a1.48 1.48 0 0 0-.74-.546m-7.98 5.383c0 .197-.07.388-.22.53a.745.745 0 0 1-1.06 0 .76.76 0 0 1-.22-.53v-5.92a.751.751 0 0 1 1.5 0zM18 9.46l-5.76-1.92a.74.74 0 0 0-.47 0L6 9.46V5.252h12z" /></Svg>;
export { SolidBoat as ReactComponent };
export { SolidBoat };
export default SolidBoat;
