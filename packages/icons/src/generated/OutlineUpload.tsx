import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineUpload = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 13.875v6a1.5 1.5 0 0 1-1.5 1.5H3c-.4 0-.78-.16-1.06-.44-.29-.28-.44-.66-.44-1.06v-6c0-.4.15-.78.44-1.06.28-.28.66-.44 1.06-.44h4.5a.75.75 0 0 1 0 1.5H3v6h18v-6h-4.5a.75.75 0 0 1 0-1.5H21a1.499 1.499 0 0 1 1.5 1.5M8.03 8.405l3.22-3.22v7.94a.75.75 0 0 0 1.5 0v-7.94l3.22 3.22a.75.75 0 1 0 1.06-1.06l-4.5-4.5a.7.7 0 0 0-.25-.16.717.717 0 0 0-.57 0c-.09.04-.17.09-.24.16l-4.5 4.5a.75.75 0 1 0 1.06 1.06m10.72 8.47a1.13 1.13 0 0 0-.7-1.04c-.2-.08-.43-.1-.65-.06s-.42.15-.57.31c-.16.15-.27.35-.31.57s-.02.45.06.65q.135.315.42.51c.18.12.4.19.62.19.3 0 .59-.12.8-.33s.33-.5.33-.8" /></Svg>;
export { OutlineUpload as ReactComponent };
