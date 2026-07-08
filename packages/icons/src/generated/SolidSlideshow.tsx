import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSlideshow = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 6v12c0 .4-.158.78-.439 1.06-.282.29-.663.44-1.061.44H6c-.398 0-.779-.15-1.061-.44A1.5 1.5 0 0 1 4.5 18V6c0-.39.158-.78.439-1.06S5.602 4.5 6 4.5h12c.398 0 .779.16 1.061.44s.439.67.439 1.06m2.25-1.5a.75.75 0 0 0-.75.75v13.5c0 .2.079.39.22.53.14.15.331.22.53.22s.39-.07.53-.22c.141-.14.22-.33.22-.53V5.25a.751.751 0 0 0-.75-.75m-19.5 0a.75.75 0 0 0-.75.75v13.5c0 .2.079.39.22.53.14.15.331.22.53.22s.39-.07.53-.22c.141-.14.22-.33.22-.53V5.25a.751.751 0 0 0-.75-.75" /></Svg>;
export { SolidSlideshow as ReactComponent };
