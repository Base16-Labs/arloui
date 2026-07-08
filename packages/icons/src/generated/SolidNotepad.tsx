import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNotepad = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 3.375h-2.25v-.75a.751.751 0 0 0-1.5 0v.75h-3v-.75a.751.751 0 0 0-1.5 0v.75h-3v-.75a.751.751 0 0 0-1.5 0v.75H4.5a.75.75 0 0 0-.75.75v15c0 .79.316 1.55.879 2.12a3 3 0 0 0 2.121.88h10.5a3 3 0 0 0 2.121-.88c.563-.57.879-1.33.879-2.12v-15a.751.751 0 0 0-.75-.75m-8.25 2.25a.751.751 0 0 1 1.5 0v.75a.751.751 0 0 1-1.5 0zm-3.75 1.5a.75.75 0 0 1-.75-.75v-.75a.751.751 0 0 1 1.5 0v.75a.751.751 0 0 1-.75.75m7.5 9H9a.751.751 0 0 1 0-1.5h6a.751.751 0 0 1 0 1.5m0-3H9a.751.751 0 0 1 0-1.5h6a.751.751 0 0 1 0 1.5m2.25-6.75a.751.751 0 0 1-1.5 0v-.75a.751.751 0 0 1 1.5 0z" /></Svg>;
export { SolidNotepad as ReactComponent };
