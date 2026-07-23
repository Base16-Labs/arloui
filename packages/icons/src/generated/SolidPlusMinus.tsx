import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPlusMinus = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3h-15A1.5 1.5 0 0 0 3 4.5v15A1.5 1.5 0 0 0 4.5 21h15a1.5 1.5 0 0 0 1.5-1.5v-15A1.5 1.5 0 0 0 19.5 3M5.25 9A.75.75 0 0 1 6 8.25h1.5v-1.5a.75.75 0 0 1 1.5 0v1.5h1.5a.75.75 0 0 1 0 1.5H9v1.5a.75.75 0 0 1-1.5 0v-1.5H6A.75.75 0 0 1 5.25 9m2.25 9c-.15 0-.29-.05-.42-.13a.72.72 0 0 1-.27-.33.72.72 0 0 1 .16-.82l9-9c.07-.07.15-.13.24-.17a1 1 0 0 1 .29-.05c.1 0 .2.02.29.05.09.04.17.1.24.17s.13.15.16.24a.72.72 0 0 1 0 .58c-.03.09-.09.17-.16.24l-9 9a.78.78 0 0 1-.53.22m10.5-.75h-4.5a.75.75 0 0 1 0-1.5H18a.75.75 0 0 1 0 1.5" /></Svg>;
export { SolidPlusMinus as ReactComponent };
