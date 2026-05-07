import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineGarage = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.5 19.125h-.75v-8.75c0-.24-.061-.49-.177-.7a1.43 1.43 0 0 0-.49-.54l-8.25-5.51a1.54 1.54 0 0 0-.833-.25c-.296 0-.585.09-.832.25l-8.25 5.51c-.205.13-.374.32-.49.54-.117.21-.178.46-.178.7v8.75H1.5a.751.751 0 0 0 0 1.5h21a.751.751 0 0 0 0-1.5m-18.75-8.75 8.25-5.5 8.25 5.5v8.75H18v-5.25a.751.751 0 0 0-.75-.75H6.75a.75.75 0 0 0-.75.75v5.25H3.75zm12.75 4.25v1.5h-3.75v-1.5zm-5.25 1.5H7.5v-1.5h3.75zm-3.75 1.5h3.75v1.5H7.5zm5.25 0h3.75v1.5h-3.75z" /></Svg>;
export { OutlineGarage as ReactComponent };
