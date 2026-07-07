import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidUploadSimple = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21 14.25v6a.75.75 0 0 1-.75.75H3.75a.75.75 0 0 1-.75-.75v-6a.75.75 0 0 1 1.5 0v5.25h15v-5.25a.75.75 0 0 1 1.5 0m-12.75-6h3v6a.75.75 0 0 0 1.5 0v-6h3c.15 0 .29-.04.41-.12.13-.09.22-.2.28-.34a.7.7 0 0 0 .04-.43.8.8 0 0 0-.2-.39l-3.75-3.75a.7.7 0 0 0-.25-.16.717.717 0 0 0-.57 0c-.09.04-.17.09-.24.16L7.72 6.97q-.165.165-.21.39c-.03.14-.01.29.04.43.06.14.16.25.28.34.12.08.27.12.42.12" /></Svg>;
export { SolidUploadSimple as ReactComponent };
