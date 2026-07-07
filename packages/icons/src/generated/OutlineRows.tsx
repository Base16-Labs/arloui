import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineRows = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 12.75h-15c-.398 0-.779.16-1.061.44S3 13.85 3 14.25V18c0 .4.158.78.439 1.06s.663.44 1.061.44h15c.398 0 .779-.16 1.061-.44S21 18.4 21 18v-3.75c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m0 5.25h-15v-3.75h15zm0-13.5h-15c-.398 0-.779.16-1.061.44S3 5.6 3 6v3.75c0 .4.158.78.439 1.06s.663.44 1.061.44h15c.398 0 .779-.16 1.061-.44S21 10.15 21 9.75V6c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 19.5 4.5m0 5.25h-15V6h15z" /></Svg>;
export { OutlineRows as ReactComponent };
