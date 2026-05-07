import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineIntersectSquare = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 8.25h-4.5v-4.5c0-.2-.079-.39-.22-.53A.71.71 0 0 0 15 3H3.75c-.199 0-.39.07-.531.22A.75.75 0 0 0 3 3.75V15c0 .19.079.39.219.53s.332.22.531.22h4.5v4.5c0 .19.079.39.219.53S8.801 21 9 21h11.25a.753.753 0 0 0 .75-.75V9c0-.2-.079-.39-.22-.53a.71.71 0 0 0-.53-.22m-15.75 6V4.5h9.75v3.75H9c-.199 0-.39.07-.531.22A.75.75 0 0 0 8.25 9v5.25zm5.25-3.44 3.439 3.44H9.75zm4.5 2.38-3.44-3.44h3.44zm5.25 6.31H9.75v-3.75H15a.753.753 0 0 0 .75-.75V9.75h3.75z" /></Svg>;
export { OutlineIntersectSquare as ReactComponent };
