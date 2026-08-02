import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineElevator = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.499 1.499 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15c.4 0 .78-.16 1.06-.44.29-.28.44-.66.44-1.06v-15c0-.4-.15-.78-.44-1.06-.28-.28-.66-.44-1.06-.44m-3 7.5v9h-3.75v-9zm-5.25 9H7.5v-9h3.75zm8.25 0H18V9.75c0-.2-.07-.39-.22-.53a.75.75 0 0 0-.53-.22H6.75a.75.75 0 0 0-.75.75v9.75H4.5v-15h15zM14.25 6.75c0 .2-.07.39-.22.53a.75.75 0 0 1-.53.22h-3a.75.75 0 1 1 0-1.5h3c.2 0 .39.08.53.22.15.14.22.33.22.53" /></Svg>;
export { OutlineElevator as ReactComponent };
export { OutlineElevator };
export default OutlineElevator;
