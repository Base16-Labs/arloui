import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidRows = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 14.25V18c0 .4-.158.78-.439 1.06s-.663.44-1.061.44h-15c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 3 18v-3.75c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h15c.398 0 .779.16 1.061.44s.439.66.439 1.06M19.5 4.5h-15c-.398 0-.779.16-1.061.44S3 5.6 3 6v3.75c0 .4.158.78.439 1.06s.663.44 1.061.44h15c.398 0 .779-.16 1.061-.44S21 10.15 21 9.75V6c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 4.5" /></Svg>;
export { SolidRows as ReactComponent };
export { SolidRows };
export default SolidRows;
