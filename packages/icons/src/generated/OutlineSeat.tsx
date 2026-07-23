import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineSeat = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.625 21.75a.75.75 0 0 1-.75.75h-9.75a.75.75 0 0 1 0-1.5h9.75a.75.75 0 0 1 .75.75m0-6.75v3a1.5 1.5 0 0 1-1.5 1.5h-8.8c-.28 0-.55-.08-.79-.22a1.47 1.47 0 0 1-.55-.61L3.535 7.8c-.1-.21-.16-.44-.16-.67 0-.24.06-.47.16-.68l2.07-4.12c.18-.35.49-.62.86-.75s.78-.1 1.13.07l3.16 1.33.04.02c.36.18.63.49.76.87.12.38.09.79-.09 1.14 0 .01 0 .02-.01.02l-1.33 2.47 2.98 6h6.02a1.5 1.5 0 0 1 1.5 1.5m-1.5 0h-6.02c-.28 0-.55-.08-.79-.22a1.47 1.47 0 0 1-.55-.61l-2.98-6c-.1-.21-.16-.44-.16-.67s.06-.46.16-.67l.01-.02 1.33-2.47-3.13-1.32c-.02 0-.03-.01-.05-.02l-2.07 4.13L10.325 18h8.8z" /></Svg>;
export { OutlineSeat as ReactComponent };
