import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineLamp = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m23.189 13.95-4.501-10.5a.8.8 0 0 0-.276-.33.75.75 0 0 0-.413-.12h-12c-.147 0-.29.04-.413.12a.8.8 0 0 0-.276.33l-4.5 10.5a.74.74 0 0 0-.058.36.73.73 0 0 0 .12.35c.07.1.163.19.272.25.109.05.23.09.355.09h9.75v4.5h-2.25c-.2 0-.39.07-.53.22a.745.745 0 0 0 0 1.06c.14.14.33.22.53.22h6a.751.751 0 0 0 0-1.5h-2.25V15h5.25v3a.751.751 0 0 0 1.28.53c.14-.14.22-.34.22-.53v-3h3c.12 0 .25-.04.36-.09.1-.06.2-.15.27-.25a.741.741 0 0 0 .06-.71M2.636 13.5l3.858-9h11.01l3.855 9z" /></Svg>;
export { OutlineLamp as ReactComponent };
export { OutlineLamp };
export default OutlineLamp;
