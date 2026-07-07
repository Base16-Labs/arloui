import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBookmark = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M17.25 2.625H6.75a1.504 1.504 0 0 0-1.5 1.5v16.5a.742.742 0 0 0 .387.65c.117.07.249.1.383.1a.84.84 0 0 0 .378-.12l5.602-3.5 5.604 3.5c.113.07.244.11.377.12.134 0 .266-.03.383-.1a.74.74 0 0 0 .386-.65v-16.5c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m0 1.5v10.64l-4.853-3.03a.8.8 0 0 0-.398-.11c-.14 0-.278.04-.397.11l-4.852 3.03V4.125zm-4.853 12.11a.8.8 0 0 0-.398-.11c-.14 0-.278.04-.397.11l-4.852 3.03v-2.73l5.25-3.28 5.25 3.28v2.73z" /></Svg>;
export { OutlineBookmark as ReactComponent };
