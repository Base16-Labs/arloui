import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineKanban = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.199 0-.39.07-.53.22-.141.14-.22.33-.22.53v14.25a1.506 1.506 0 0 0 1.5 1.5h3.75c.398 0 .78-.16 1.06-.44.282-.28.44-.67.44-1.06v-4.5h4.5v1.5a1.506 1.506 0 0 0 1.5 1.5h3.75c.398 0 .78-.16 1.06-.44.282-.28.44-.67.44-1.06V4.5c0-.2-.079-.39-.22-.53a.71.71 0 0 0-.53-.22m-12 15H4.5v-7.5h3.75zm0-9H4.5v-4.5h3.75zm6 3h-4.5v-7.5h4.5zm5.25 3h-3.75v-4.5h3.75zm0-6h-3.75v-4.5h3.75z" /></Svg>;
export { OutlineKanban as ReactComponent };
export { OutlineKanban };
export default OutlineKanban;
