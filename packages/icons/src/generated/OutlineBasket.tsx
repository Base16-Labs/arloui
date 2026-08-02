import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBasket = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12.75 12.374v5.25a.75.75 0 0 1-1.5 0v-5.25a.749.749 0 0 1 1.28-.53c.141.141.22.331.22.53m3.454-.075-.525 5.25a.74.74 0 0 0 .164.552.753.753 0 0 0 .507.273 1 1 0 0 0 .076 0 .75.75 0 0 0 .745-.675l.525-5.25a.747.747 0 0 0-.671-.821.75.75 0 0 0-.821.671m-8.408 0a.746.746 0 0 0-.821-.671.75.75 0 0 0-.671.821l.525 5.25a.75.75 0 0 0 .75.675q.037.003.076 0a.8.8 0 0 0 .28-.085.76.76 0 0 0 .363-.445q.043-.142.028-.291zm14.697-2.825-1.412 10.599a1.507 1.507 0 0 1-1.487 1.301H4.406a1.5 1.5 0 0 1-1.487-1.301L1.507 9.474a.746.746 0 0 1 .743-.85h4.16l5.028-5.744a.75.75 0 0 1 1.125 0l5.027 5.744h4.16a.752.752 0 0 1 .743.85m-14.09-.85h7.194L12 4.513zm12.49 1.5H3.107l1.299 9.75h15.188z" /></Svg>;
export { OutlineBasket as ReactComponent };
export { OutlineBasket };
export default OutlineBasket;
