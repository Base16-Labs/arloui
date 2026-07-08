import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPen = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.935 7.245-4.19-4.18c-.14-.14-.3-.25-.49-.33-.18-.07-.37-.11-.57-.11s-.39.04-.57.11c-.19.08-.35.19-.49.33l-11.56 11.56c-.14.13-.25.3-.33.48-.07.18-.11.38-.11.58v4.19a1.499 1.499 0 0 0 1.5 1.5h4.19q.3 0 .57-.12c.19-.07.35-.18.49-.32l7.84-7.85.33 1.31-3.45 3.45a.75.75 0 1 0 1.06 1.06l3.75-3.75c.09-.09.16-.21.19-.33.04-.13.04-.26.01-.39l-.65-2.58 2.48-2.48c.14-.14.25-.31.33-.49.07-.18.11-.38.11-.57 0-.2-.04-.4-.11-.58-.08-.18-.19-.35-.33-.49m-3.31 3.32-4.19-4.19 2.25-2.25 4.19 4.19z" /></Svg>;
export { SolidPen as ReactComponent };
