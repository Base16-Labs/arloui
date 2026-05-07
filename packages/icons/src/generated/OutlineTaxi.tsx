import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTaxi = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.5 11.25h-1.07l-2.56-4.49c-.13-.23-.32-.42-.55-.55-.23-.14-.49-.21-.75-.21h-2.06l-1.13-2.8a1.49 1.49 0 0 0-1.39-.95h-1.98c-.3 0-.6.09-.84.26-.25.17-.44.41-.56.69L8.49 6H6.43c-.26 0-.52.07-.75.21-.23.13-.42.32-.55.55l-2.56 4.49H1.5a.75.75 0 0 0 0 1.5h.75v7.5a1.5 1.5 0 0 0 1.5 1.5H6a1.5 1.5 0 0 0 1.5-1.5v-1.5h9v1.5a1.5 1.5 0 0 0 1.5 1.5h2.25a1.5 1.5 0 0 0 1.5-1.5v-7.5h.75a.75.75 0 0 0 0-1.5m-11.49-7.5h1.98l.9 2.25h-3.78zM6.43 7.5h11.14l2.14 3.75H4.29zM6 20.25H3.75v-1.5H6zm12 0v-1.5h2.25v1.5zm2.25-3H3.75v-4.5h16.5zM5.25 15a.75.75 0 0 1 .75-.75h1.5a.75.75 0 0 1 0 1.5H6a.75.75 0 0 1-.75-.75m10.5 0a.75.75 0 0 1 .75-.75H18a.75.75 0 0 1 0 1.5h-1.5a.75.75 0 0 1-.75-.75" /></Svg>;
export { OutlineTaxi as ReactComponent };
