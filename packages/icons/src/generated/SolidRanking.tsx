import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidRanking = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.5 18.75h-.75V13.5c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 20.25 12H16.5V5.25c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 15 3.75H9c-.398 0-.779.16-1.061.44S7.5 4.85 7.5 5.25v3H3.75c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v9H1.5a.751.751 0 0 0 0 1.5h21a.751.751 0 0 0 0-1.5m-15 0H3.75v-9H7.5zm5.625-6a.751.751 0 0 1-1.5 0v-2.71l-.138.04a.6.6 0 0 1-.29.04.7.7 0 0 1-.282-.08.6.6 0 0 1-.232-.18.738.738 0 0 1-.104-.82.7.7 0 0 1 .18-.23q.112-.105.254-.15l1.125-.37a.7.7 0 0 1 .35-.03c.118.01.229.06.326.13q.145.105.229.27c.054.1.082.22.082.34zm7.125 6H16.5V13.5h3.75z" /></Svg>;
export { SolidRanking as ReactComponent };
