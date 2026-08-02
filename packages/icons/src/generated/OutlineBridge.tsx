import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBridge = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 15h-3V9.5c.72.89 1.66 1.58 2.72 2.01.18.07.39.06.57-.02.18-.07.32-.22.39-.4.08-.18.08-.39 0-.57a.72.72 0 0 0-.4-.4c-.97-.39-1.8-1.07-2.39-1.93-.58-.87-.89-1.9-.89-2.94a.75.75 0 0 0-1.5 0c0 1.39-.55 2.73-1.54 3.71-.98.98-2.32 1.54-3.71 1.54s-2.73-.56-3.71-1.54a5.22 5.22 0 0 1-1.54-3.71.75.75 0 0 0-1.5 0c0 1.04-.31 2.07-.89 2.94-.59.86-1.42 1.54-2.39 1.93-.18.07-.33.22-.4.4-.08.18-.08.39 0 .57.07.18.21.33.39.4.18.08.39.09.57.02 1.06-.43 2-1.12 2.72-2.01V15h-3a.75.75 0 0 0 0 1.5h3v2.25a.75.75 0 0 0 1.5 0V16.5h10.5v2.25a.75.75 0 0 0 1.5 0V16.5h3a.75.75 0 0 0 0-1.5m-8.25-3.17V15h-3v-3.17a6.9 6.9 0 0 0 3 0M6.75 9.48c.61.76 1.38 1.38 2.25 1.81V15H6.75zM15 15v-3.71a6.8 6.8 0 0 0 2.25-1.8V15z" /></Svg>;
export { OutlineBridge as ReactComponent };
export { OutlineBridge };
export default OutlineBridge;
