import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineNotePencil = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m21.155 5.845-3-3a.8.8 0 0 0-.243-.17 1 1 0 0 0-.287-.05 1 1 0 0 0-.288.05.8.8 0 0 0-.243.17l-9 9a.75.75 0 0 0-.22.53v3a.753.753 0 0 0 .75.75h3q.15 0 .288-.06a.8.8 0 0 0 .243-.16l9-9a.8.8 0 0 0 .22-.53.749.749 0 0 0-.22-.53m-9.84 8.78h-1.94v-1.94l6-6 1.94 1.94zm7.06-7.06-1.94-1.94 1.19-1.19 1.94 1.94zm2.25 4.81v7.5a1.506 1.506 0 0 1-1.5 1.5h-15c-.398 0-.78-.16-1.061-.44a1.5 1.5 0 0 1-.44-1.06v-15c0-.4.159-.78.44-1.06.281-.29.663-.44 1.06-.44h7.5a.753.753 0 0 1 .75.75.753.753 0 0 1-.75.75h-7.5v15h15v-7.5a.753.753 0 0 1 1.28-.53c.142.14.22.33.22.53" /></Svg>;
export { OutlineNotePencil as ReactComponent };
export { OutlineNotePencil };
export default OutlineNotePencil;
