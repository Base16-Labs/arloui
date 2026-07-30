import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineNotEquals = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 15.005c0 .2-.08.39-.22.53-.15.14-.34.22-.53.22H9.6l-4.55 5c-.13.15-.32.23-.52.24a.7.7 0 0 1-.53-.2.72.72 0 0 1-.25-.51c-.01-.2.06-.39.19-.54l3.63-3.99H3.75a.8.8 0 0 1-.54-.22.74.74 0 0 1-.21-.53c0-.2.07-.39.21-.53a.8.8 0 0 1 .54-.22h5.19l4.09-4.5H3.75a.8.8 0 0 1-.54-.22.74.74 0 0 1-.21-.53c0-.2.07-.39.21-.53a.8.8 0 0 1 .54-.22h10.64l4.55-5.01a.77.77 0 0 1 .52-.24c.19 0 .39.07.53.2a.735.735 0 0 1 .06 1.05l-3.63 4h3.83c.19 0 .38.08.53.22a.75.75 0 0 1 0 1.06c-.15.14-.34.22-.53.22h-5.2l-4.09 4.5h9.29c.19 0 .38.08.53.22.14.14.22.33.22.53" /></Svg>;
export { OutlineNotEquals as ReactComponent };
