import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSlidersHorizontal = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M3 7.505a.753.753 0 0 1 .75-.75h3.485c.161-.54.494-1.02.947-1.36a2.68 2.68 0 0 1 1.568-.52c.565 0 1.115.19 1.568.52.454.34.786.82.947 1.36h7.985a.751.751 0 0 1 0 1.5h-7.985a2.62 2.62 0 0 1-2.515 1.87 2.629 2.629 0 0 1-2.515-1.87H3.75a.753.753 0 0 1-.75-.75m17.25 8.25h-1.985a2.65 2.65 0 0 0-.947-1.36 2.68 2.68 0 0 0-1.568-.52c-.565 0-1.115.19-1.568.52-.454.34-.786.82-.947 1.36H3.75a.753.753 0 0 0-.75.75.753.753 0 0 0 .75.75h9.485a2.62 2.62 0 0 0 2.515 1.87 2.622 2.622 0 0 0 2.515-1.87h1.985a.751.751 0 0 0 0-1.5" /></Svg>;
export { SolidSlidersHorizontal as ReactComponent };
