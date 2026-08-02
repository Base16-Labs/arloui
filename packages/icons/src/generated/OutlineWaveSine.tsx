import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineWaveSine = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.433 12.32c-2.07 4.39-3.88 6.43-5.74 6.43-2.35 0-3.82-3.12-5.37-6.43-1.23-2.61-2.61-5.57-4.01-5.57-1.54 0-3.4 3.49-4.38 5.57a.78.78 0 0 1-.42.38.8.8 0 0 1-.57-.03.8.8 0 0 1-.39-.42.8.8 0 0 1 .02-.57c2.06-4.39 3.88-6.43 5.74-6.43 2.35 0 3.82 3.12 5.37 6.43 1.22 2.61 2.61 5.57 4.01 5.57 1.53 0 3.4-3.49 4.38-5.57.08-.17.23-.31.42-.37a.75.75 0 0 1 .57.02c.18.09.31.24.38.42.07.19.06.39-.02.57z" /></Svg>;
export { OutlineWaveSine as ReactComponent };
export { OutlineWaveSine };
export default OutlineWaveSine;
