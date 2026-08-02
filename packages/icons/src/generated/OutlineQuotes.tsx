import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineQuotes = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M9.375 4.875H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v6c0 .4.158.78.439 1.06s.663.44 1.061.44h5.625v.75a3 3 0 0 1-3 3 .751.751 0 0 0 0 1.5 4.504 4.504 0 0 0 4.5-4.5v-8.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m0 7.5H3.75v-6h5.625zm10.875-7.5h-5.625c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v6c0 .4.158.78.439 1.06s.663.44 1.061.44h5.625v.75a3 3 0 0 1-3 3 .751.751 0 0 0 0 1.5c1.193 0 2.337-.48 3.18-1.32.84-.84 1.32-1.99 1.32-3.18v-8.25a1.5 1.5 0 0 0-1.5-1.5m0 7.5h-5.625v-6h5.625z" /></Svg>;
export { OutlineQuotes as ReactComponent };
export { OutlineQuotes };
export default OutlineQuotes;
