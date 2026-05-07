import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineEject = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.498 15.375h-15a1.499 1.499 0 0 0-1.5 1.5v2.25a1.5 1.5 0 0 0 1.5 1.5h15c.4 0 .78-.16 1.06-.44.29-.28.44-.66.44-1.06v-2.25c0-.4-.15-.78-.44-1.06-.28-.28-.66-.44-1.06-.44m0 3.75h-15v-2.25h15zm-14.97-5.25h14.95c.3 0 .59-.09.84-.25s.44-.39.56-.67a1.463 1.463 0 0 0-.29-1.6l-6.91-7.27c-.22-.22-.48-.4-.77-.53-.28-.12-.59-.18-.91-.18-.31 0-.62.06-.91.18-.28.13-.54.31-.76.53l-6.91 7.27a1.46 1.46 0 0 0-.29 1.6c.11.28.31.51.56.67s.54.25.84.25m6.89-8.75a.77.77 0 0 1 .58-.25c.11 0 .22.02.32.06.1.05.2.11.27.19l6.9 7.25H4.518z" /></Svg>;
export { OutlineEject as ReactComponent };
