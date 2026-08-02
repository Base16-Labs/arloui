import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineShovel = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m22.655 5.845-4.499-4.5a.78.78 0 0 0-.531-.22.782.782 0 0 0-.531.22.75.75 0 0 0 0 1.06l1.721 1.72-6.657 6.66-3.223-3.22a1.5 1.5 0 0 0-1.06-.44c-.398 0-.779.16-1.06.44l-5.25 5.25c-.14.14-.251.3-.327.49a1.5 1.5 0 0 0-.113.57v7.5c0 .4.158.78.439 1.06s.663.44 1.061.44h7.5c.197 0 .392-.04.574-.11.182-.08.348-.19.486-.33l5.25-5.25c.281-.28.439-.66.439-1.06s-.158-.78-.439-1.06l-3.216-3.22 6.656-6.66 1.72 1.72c.07.07.15.13.24.17.09.03.19.05.29.05s.2-.02.29-.05c.09-.04.17-.1.24-.17s.13-.15.16-.24a.72.72 0 0 0 0-.57.7.7 0 0 0-.16-.25m-7.28 10.28-5.25 5.25h-7.5v-7.5l5.25-5.25 3.219 3.22-3.75 3.75a.748.748 0 0 0 .818 1.22.64.64 0 0 0 .244-.16l3.75-3.75z" /></Svg>;
export { OutlineShovel as ReactComponent };
export { OutlineShovel };
export default OutlineShovel;
