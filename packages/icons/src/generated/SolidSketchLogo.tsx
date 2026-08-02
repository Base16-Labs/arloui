import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSketchLogo = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m23.061 8.875-5.25-6a.8.8 0 0 0-.253-.19.8.8 0 0 0-.309-.06h-10.5a.8.8 0 0 0-.309.06.8.8 0 0 0-.254.19l-5.25 6a.754.754 0 0 0 .016 1.01l10.5 11.25c.07.07.155.13.25.17a.6.6 0 0 0 .299.07c.103 0 .204-.02.299-.07.094-.04.179-.1.249-.17l10.5-11.25a.757.757 0 0 0 .012-1.01m-2.215-.25h-3.972l-3.375-4.5h3.409zm-13.855 1.5 2.824 7.06-6.59-7.06zm10.016 0h3.766l-6.591 7.06zm-9.918-6h3.41l-3.375 4.5H3.152z" /></Svg>;
export { SolidSketchLogo as ReactComponent };
export { SolidSketchLogo };
export default SolidSketchLogo;
