import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineNotches = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m20.41 12.905-7.5 7.5a.82.82 0 0 1-.53.22.821.821 0 0 1-.54-.22.82.82 0 0 1-.22-.53.776.776 0 0 1 .22-.53l7.5-7.5c.07-.07.16-.13.25-.17a1 1 0 0 1 .29-.05c.09 0 .19.02.28.05a.776.776 0 0 1 .47.7.821.821 0 0 1-.22.53m-1.5-9.31a.9.9 0 0 0-.25-.17 1 1 0 0 0-.28-.05c-.1 0-.2.02-.29.05-.09.04-.18.1-.25.17L3.59 17.845a.75.75 0 0 0 0 1.06c.15.14.34.22.54.22.19 0 .38-.08.53-.22l14.25-14.25a.82.82 0 0 0 .22-.53.776.776 0 0 0-.22-.53" /></Svg>;
export { OutlineNotches as ReactComponent };
