import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineHouse = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m20.56 10.555-7.5-7.5a1.5 1.5 0 0 0-1.06-.43c-.398 0-.779.15-1.06.43l-7.5 7.5a1.499 1.499 0 0 0-.44 1.07v9a.751.751 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75v-5.25h3v5.25a.751.751 0 0 0 .75.75h6a.75.75 0 0 0 .75-.75v-9a1.5 1.5 0 0 0-.44-1.07m-1.06 9.32H15v-5.25c0-.2-.079-.39-.22-.53a.71.71 0 0 0-.53-.22h-4.5c-.199 0-.39.07-.53.22a.75.75 0 0 0-.22.53v5.25H4.5v-8.25l7.5-7.5 7.5 7.5z" /></Svg>;
export { OutlineHouse as ReactComponent };
