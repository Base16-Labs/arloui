import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineClipboardText = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M15.75 14.625a.751.751 0 0 1-.75.75H9a.751.751 0 0 1 0-1.5h6a.75.75 0 0 1 .75.75m-.75-3.75H9a.751.751 0 0 0 0 1.5h6a.751.751 0 0 0 0-1.5m5.25-6v15.75c0 .4-.158.78-.439 1.06s-.663.44-1.061.44H5.25c-.398 0-.779-.16-1.061-.44a1.5 1.5 0 0 1-.439-1.06V4.875c0-.4.158-.78.439-1.06s.663-.44 1.061-.44h3.399A4.469 4.469 0 0 1 12 1.875a4.47 4.47 0 0 1 3.351 1.5h3.399c.398 0 .779.16 1.061.44s.439.66.439 1.06M9 6.375h6c0-.8-.316-1.56-.879-2.12A3 3 0 0 0 12 3.375a3 3 0 0 0-2.121.88A2.98 2.98 0 0 0 9 6.375m9.75-1.5h-2.508c.171.48.258.99.258 1.5v.75a.751.751 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-.75c0-.51.087-1.02.258-1.5H5.25v15.75h13.5z" /></Svg>;
export { OutlineClipboardText as ReactComponent };
