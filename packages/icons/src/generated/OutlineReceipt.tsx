import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineReceipt = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M6.75 9.75A.751.751 0 0 1 7.5 9h9a.751.751 0 0 1 0 1.5h-9a.75.75 0 0 1-.75-.75m.75 3.75h9a.751.751 0 0 0 0-1.5h-9a.751.751 0 0 0 0 1.5m14.25-8.25V19.5q-.001.195-.095.36a.8.8 0 0 1-.261.28.9.9 0 0 1-.361.11.8.8 0 0 1-.369-.08L18 18.84l-2.664 1.33a.8.8 0 0 1-.336.08.8.8 0 0 1-.336-.08L12 18.84l-2.664 1.33a.8.8 0 0 1-.336.08.8.8 0 0 1-.336-.08L6 18.84l-2.664 1.33a.8.8 0 0 1-.369.08.9.9 0 0 1-.361-.11.8.8 0 0 1-.261-.28.7.7 0 0 1-.095-.36V5.25c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h16.5c.398 0 .779.16 1.061.44s.439.66.439 1.06m-1.5 0H3.75v13.04l1.914-.96A.66.66 0 0 1 6 17.25c.117 0 .231.02.336.08L9 18.66l2.664-1.33a.66.66 0 0 1 .336-.08c.117 0 .231.02.336.08L15 18.66l2.664-1.33a.66.66 0 0 1 .336-.08c.117 0 .231.02.336.08l1.914.96z" /></Svg>;
export { OutlineReceipt as ReactComponent };
export { OutlineReceipt };
export default OutlineReceipt;
