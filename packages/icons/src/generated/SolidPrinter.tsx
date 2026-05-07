import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPrinter = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.5 9v7.5a.75.75 0 0 1-.75.75h-3v3A.75.75 0 0 1 18 21H6a.75.75 0 0 1-.75-.75v-3h-3a.75.75 0 0 1-.75-.75V9c0-1.24 1.07-2.25 2.37-2.25h1.38v-3A.75.75 0 0 1 6 3h12a.75.75 0 0 1 .75.75v3h1.38c1.3 0 2.37 1.01 2.37 2.25M6.75 6.75h10.5V4.5H6.75zM17.25 15H6.75v4.5h10.5zm1.5-4.13c0-.22-.07-.44-.19-.62-.12-.19-.3-.33-.5-.42-.21-.08-.44-.1-.65-.06a1.1 1.1 0 0 0-.58.31c-.16.16-.26.36-.31.57-.04.22-.02.45.07.65.08.21.22.39.41.51.18.12.4.19.62.19.3 0 .59-.12.8-.33s.33-.5.33-.8" /></Svg>;
export { SolidPrinter as ReactComponent };
