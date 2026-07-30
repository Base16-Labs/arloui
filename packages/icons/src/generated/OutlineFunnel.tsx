import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFunnel = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.618 3.89c-.12-.26-.31-.49-.55-.65s-.53-.24-.82-.24h-16.5c-.29 0-.57.09-.82.24-.24.16-.43.39-.55.65-.12.27-.15.56-.11.85.05.29.18.55.37.77l.01.01 6.35 6.78v7.2a1.49 1.49 0 0 0 .79 1.32c.24.13.51.19.78.18s.54-.1.76-.25l3-2c.21-.14.38-.32.49-.54.12-.22.18-.46.18-.71v-5.2l6.35-6.78.01-.01c.2-.21.33-.48.37-.77.05-.29.01-.58-.11-.85m-7.92 7.6c-.13.14-.2.32-.2.51v5.5l-3 2V12c0-.19-.07-.37-.2-.51L3.748 4.5h16.5z" /></Svg>;
export { OutlineFunnel as ReactComponent };
