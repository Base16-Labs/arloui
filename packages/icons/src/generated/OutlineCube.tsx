import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineCube = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.97 6.2-8.25-4.51c-.22-.12-.47-.19-.72-.19s-.5.07-.72.19L3.03 6.21c-.24.12-.43.31-.57.55-.14.23-.21.49-.21.76v8.96a1.506 1.506 0 0 0 .78 1.32l8.25 4.51c.22.12.47.19.72.19s.5-.07.72-.19l8.25-4.51a1.5 1.5 0 0 0 .78-1.32V7.52a1.506 1.506 0 0 0-.78-1.32M12 3l7.53 4.13L12 11.25 4.47 7.13zM3.75 8.44l7.5 4.1v8.05l-7.5-4.1zm9 12.15v-8.04l7.5-4.11v8.04z" /></Svg>;
export { OutlineCube as ReactComponent };
export { OutlineCube };
export default OutlineCube;
