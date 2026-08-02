import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidReceipt = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06V19.5q.001.195.095.36c.062.11.152.21.261.28a.9.9 0 0 0 .361.11c.127 0 .254-.02.369-.08L6 18.84l2.664 1.33c.105.05.219.08.336.08s.231-.03.336-.08L12 18.84l2.664 1.33c.105.05.219.08.336.08s.231-.03.336-.08L18 18.84l2.664 1.33c.115.06.242.08.369.08a.9.9 0 0 0 .361-.11.8.8 0 0 0 .261-.28.7.7 0 0 0 .095-.36V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44M16.5 13.5h-9a.751.751 0 0 1 0-1.5h9a.751.751 0 0 1 0 1.5m0-3h-9a.751.751 0 0 1 0-1.5h9a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidReceipt as ReactComponent };
export { SolidReceipt };
export default SolidReceipt;
