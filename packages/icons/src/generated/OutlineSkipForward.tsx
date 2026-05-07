import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSkipForward = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18.75 3a.75.75 0 0 0-.75.75v6.49L6.79 3.23A1.4 1.4 0 0 0 6.04 3c-.27-.01-.53.05-.76.18-.24.13-.43.32-.57.55-.13.23-.21.49-.21.76v15.02c0 .26.08.52.21.75.14.23.34.42.57.55.23.12.5.19.76.18.27-.01.53-.08.75-.22L18 13.76v6.49a.75.75 0 0 0 1.5 0V3.75a.75.75 0 0 0-.75-.75M6 19.49V4.5L17.99 12z" /></Svg>;
export { OutlineSkipForward as ReactComponent };
