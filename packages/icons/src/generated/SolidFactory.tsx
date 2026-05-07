import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFactory = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 20.25H21V13.4l-1.41-9.86c-.05-.36-.23-.69-.5-.92a1.52 1.52 0 0 0-.99-.37h-1.7a1.505 1.505 0 0 0-1.48 1.29l-1.09 7.59L10.2 8.4a.85.85 0 0 0-.38-.15.84.84 0 0 0-.41.08c-.12.06-.22.16-.3.28-.07.12-.11.25-.11.39v3L4.2 8.4a.85.85 0 0 0-.38-.15.84.84 0 0 0-.41.08c-.12.06-.22.16-.3.28-.07.12-.11.25-.11.39v11.25h-.75a.75.75 0 0 0 0 1.5h19.5a.75.75 0 0 0 0-1.5M10.12 18H7.5a.75.75 0 0 1 0-1.5h2.62c.2 0 .39.08.54.22a.75.75 0 0 1 0 1.06.8.8 0 0 1-.54.22m6.38 0h-2.62a.8.8 0 0 1-.54-.22.75.75 0 0 1 0-1.06.8.8 0 0 1 .54-.22h2.62a.75.75 0 0 1 0 1.5m-.5-5.25-.8-.6 1.2-8.4h1.7l1.29 9z" /></Svg>;
export { SolidFactory as ReactComponent };
