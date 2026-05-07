import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBookmarks = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M18 2.25H9a1.504 1.504 0 0 0-1.5 1.5v1.5H6a1.504 1.504 0 0 0-1.5 1.5V21q.001.21.11.39c.072.12.175.21.297.27.123.07.26.1.398.09a.75.75 0 0 0 .381-.14l4.814-3.44 4.815 3.44c.112.08.244.13.382.13.137.01.274-.01.397-.08a.7.7 0 0 0 .296-.27q.109-.18.11-.39v-3.69l1.814 1.3c.112.08.244.13.382.14.137.01.275-.02.397-.09a.7.7 0 0 0 .298-.27.76.76 0 0 0 .109-.39V3.75c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 18 2.25m0 14.29-1.5-1.07V6.75c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 15 5.25H9v-1.5h9z" /></Svg>;
export { SolidBookmarks as ReactComponent };
