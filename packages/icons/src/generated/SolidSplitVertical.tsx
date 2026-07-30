import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSplitVertical = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 14.25a.75.75 0 0 1-.75.75h-6.75v3H15c.15 0 .29.05.42.13.12.08.22.2.27.33a.72.72 0 0 1-.16.82l-3 3c-.07.07-.15.13-.24.16a.72.72 0 0 1-.58 0 .6.6 0 0 1-.24-.16l-3-3a.72.72 0 0 1-.16-.82c.05-.13.15-.25.27-.33.13-.08.27-.13.42-.13h2.25v-3H4.5a.75.75 0 0 1 0-1.5h15a.75.75 0 0 1 .75.75M4.5 10.5h15a.75.75 0 0 0 0-1.5h-6.75V6H15q.225 0 .42-.12c.12-.09.22-.2.27-.34.06-.14.08-.29.05-.44a.76.76 0 0 0-.21-.38l-3-3A.78.78 0 0 0 12 1.5a.776.776 0 0 0-.53.22l-3 3c-.11.11-.18.24-.21.38-.03.15-.01.3.05.44.05.14.15.25.27.34Q8.775 6 9 6h2.25v3H4.5a.75.75 0 0 0 0 1.5" /></Svg>;
export { SolidSplitVertical as ReactComponent };
