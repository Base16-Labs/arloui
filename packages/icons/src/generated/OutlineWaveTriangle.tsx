import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineWaveTriangle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m22.36 12.44-4.88 6.75c-.07.1-.16.18-.26.23-.11.05-.23.08-.35.08s-.23-.03-.34-.08a.67.67 0 0 1-.27-.23L7.12 6.53l-4.26 5.91c-.06.08-.13.15-.22.2-.08.05-.17.08-.27.1s-.2.01-.29-.01a.7.7 0 0 1-.27-.12.7.7 0 0 1-.2-.22.6.6 0 0 1-.1-.27c-.02-.1-.01-.2.01-.29q.03-.15.12-.27l4.87-6.75a.74.74 0 0 1 .61-.31c.12 0 .24.03.35.08.1.05.19.13.26.23l9.14 12.66 4.27-5.91c.06-.08.13-.15.22-.2a.6.6 0 0 1 .27-.1c.1-.02.2-.01.29.01q.15.03.27.12c.08.06.15.13.2.21.05.09.09.18.1.28.02.1.01.19-.01.29a.7.7 0 0 1-.12.27" /></Svg>;
export { OutlineWaveTriangle as ReactComponent };
export { OutlineWaveTriangle };
export default OutlineWaveTriangle;
