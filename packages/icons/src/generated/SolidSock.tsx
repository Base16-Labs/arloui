import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSock = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18.728 1.15h-8.25c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v7.19l-3.633 3.63a5.525 5.525 0 0 0 .045 7.77 5.47 5.47 0 0 0 3.874 1.61 5.5 5.5 0 0 0 3.893-1.57l6.415-6.41c.209-.21.375-.46.488-.73q.17-.42.168-.87V2.65c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m0 1.5V4.9h-8.25V2.65zm-.219 11.15-2.987 2.99a4.486 4.486 0 0 1 1.26-5.74c.573-.43 1.24-.72 1.946-.84v3.07c0 .19-.079.38-.219.52" /></Svg>;
export { SolidSock as ReactComponent };
