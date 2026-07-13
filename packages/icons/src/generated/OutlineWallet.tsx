import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineWallet = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.875 6.75h-15a.751.751 0 0 1 0-1.5h12.75a.751.751 0 0 0 0-1.5H4.875c-.597 0-1.169.24-1.591.66S2.625 5.4 2.625 6v12c0 .6.237 1.17.659 1.59s.994.66 1.591.66h15c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V8.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m0 12h-15a.75.75 0 0 1-.75-.75V8.12c.241.09.494.13.75.13h15zm-4.5-5.62a1.112 1.112 0 0 1 .694-1.04c.206-.09.432-.11.65-.07.219.05.419.15.576.31a1.13 1.13 0 0 1 .244 1.23c-.085.2-.229.38-.414.5s-.402.19-.625.19a1.127 1.127 0 0 1-1.125-1.12" /></Svg>;
export { OutlineWallet as ReactComponent };
