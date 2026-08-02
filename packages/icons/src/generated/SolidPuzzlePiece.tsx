import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPuzzlePiece = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M16.667 21.75h3.958c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06v-3.53a.747.747 0 0 0-.677-.74.64.64 0 0 0-.36.05c-.266.11-.55.17-.838.17-1.24 0-2.25-1.05-2.25-2.32 0-1.28 1.01-2.32 2.25-2.32.288 0 .572.05.838.16a.75.75 0 0 0 .362.06.7.7 0 0 0 .343-.13.7.7 0 0 0 .245-.27.74.74 0 0 0 .087-.35V7.5c0-.4-.158-.78-.439-1.06A1.5 1.5 0 0 0 20.625 6h-3.396a3.364 3.364 0 0 0-.968-2.76 3.34 3.34 0 0 0-2.386-.99c-.895 0-1.754.35-2.386.99A3.36 3.36 0 0 0 10.521 6H7.125c-.398 0-.779.16-1.061.44s-.439.66-.439 1.06v3.02c-.125-.02-.25-.02-.375-.02-.895 0-1.754.35-2.386.99a3.37 3.37 0 0 0 0 4.77c.632.63 1.491.99 2.386.99.125 0 .25-.01.375-.02v3.02c0 .4.158.78.439 1.06s.663.44 1.061.44h3.958" /></Svg>;
export { SolidPuzzlePiece as ReactComponent };
export { SolidPuzzlePiece };
export default SolidPuzzlePiece;
