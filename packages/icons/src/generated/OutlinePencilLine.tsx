import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePencilLine = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m20.935 7.245-4.19-4.18c-.14-.14-.3-.25-.49-.33-.18-.07-.37-.11-.57-.11s-.39.04-.57.11c-.19.08-.35.19-.49.33l-11.56 11.56c-.14.13-.25.3-.33.48-.07.18-.11.38-.11.58v4.19a1.499 1.499 0 0 0 1.5 1.5h15.75a.75.75 0 0 0 0-1.5h-9.44l10.5-10.5c.14-.14.25-.31.33-.49.07-.18.11-.38.11-.57 0-.2-.04-.4-.11-.58-.08-.18-.19-.35-.33-.49m-8.56.19 1.56 1.56-7.93 7.94-1.57-1.56zm-8.25 12.44v-2.69l2.69 2.69zm4.5-.31-1.56-1.57 7.94-7.94 1.56 1.57zm9-9-4.19-4.19 2.25-2.25 4.19 4.19z" /></Svg>;
export { OutlinePencilLine as ReactComponent };
