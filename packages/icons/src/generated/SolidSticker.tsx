import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSticker = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M15.75 3h-7.5a5.27 5.27 0 0 0-3.711 1.54A5.25 5.25 0 0 0 3 8.25v7.5a5.25 5.25 0 0 0 1.539 3.71A5.23 5.23 0 0 0 8.25 21h4.5c.081 0 .161-.01.237-.04 2.459-.82 7.154-5.51 7.975-7.97a.8.8 0 0 0 .038-.24v-4.5a5.25 5.25 0 0 0-1.539-3.71A5.27 5.27 0 0 0 15.75 3m-3 16.45V16.5a3.75 3.75 0 0 1 3.75-3.75h2.946c-.869 2.02-4.676 5.83-6.696 6.7" /></Svg>;
export { SolidSticker as ReactComponent };
