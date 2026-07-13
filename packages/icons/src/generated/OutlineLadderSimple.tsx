import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineLadderSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18 2.25c-.199 0-.39.07-.53.22a.75.75 0 0 0-.22.53v3H6.75V3c0-.2-.079-.39-.22-.53A.71.71 0 0 0 6 2.25c-.199 0-.39.07-.53.22a.75.75 0 0 0-.22.53v18a.751.751 0 0 0 1.28.53c.141-.14.22-.34.22-.53v-3h10.5v3a.751.751 0 0 0 1.28.53c.141-.14.22-.34.22-.53V3c0-.2-.079-.39-.22-.53a.71.71 0 0 0-.53-.22m-.75 5.25v3.75H6.75V7.5zm-10.5 9v-3.75h10.5v3.75z" /></Svg>;
export { OutlineLadderSimple as ReactComponent };
