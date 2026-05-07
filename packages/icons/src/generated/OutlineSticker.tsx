import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSticker = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M15.75 3h-7.5a5.27 5.27 0 0 0-3.711 1.54A5.25 5.25 0 0 0 3 8.25v7.5a5.25 5.25 0 0 0 1.539 3.71A5.23 5.23 0 0 0 8.25 21h4.5c.081 0 .161-.01.237-.04 2.459-.82 7.154-5.51 7.975-7.97a.8.8 0 0 0 .038-.24v-4.5a5.25 5.25 0 0 0-1.539-3.71A5.27 5.27 0 0 0 15.75 3M4.5 15.75v-7.5A3.75 3.75 0 0 1 8.25 4.5h7.5a3.75 3.75 0 0 1 3.75 3.75V12h-2.25a5.27 5.27 0 0 0-3.711 1.54A5.25 5.25 0 0 0 12 17.25v2.25H8.25c-.995 0-1.948-.39-2.652-1.1A3.73 3.73 0 0 1 4.5 15.75m9 3.3v-1.8a3.75 3.75 0 0 1 3.75-3.75h1.794c-1.138 1.83-3.716 4.41-5.544 5.55" /></Svg>;
export { OutlineSticker as ReactComponent };
