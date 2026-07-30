import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidArticle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.4 0-.78.158-1.06.439s-.44.663-.44 1.061v13.5c0 .398.16.779.44 1.061s.66.439 1.06.439h16.5c.4 0 .78-.158 1.06-.439s.44-.663.44-1.061V5.25c0-.398-.16-.779-.44-1.061a1.5 1.5 0 0 0-1.06-.439m-3.75 12h-9a.751.751 0 0 1 0-1.5h9a.751.751 0 0 1 0 1.5m0-3h-9a.751.751 0 0 1 0-1.5h9a.751.751 0 0 1 0 1.5m0-3h-9a.751.751 0 0 1 0-1.5h9a.751.751 0 0 1 0 1.5" /></Svg>;
export { SolidArticle as ReactComponent };
