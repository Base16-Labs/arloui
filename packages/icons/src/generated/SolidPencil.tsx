import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPencil = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.935 7.245-4.19-4.18c-.14-.14-.3-.25-.49-.33a1.4 1.4 0 0 0-.57-.11c-.2 0-.39.03-.57.11-.19.08-.35.19-.49.33l-11.56 11.56q-.21.21-.33.48c-.07.18-.11.38-.11.58v4.19a1.499 1.499 0 0 0 1.5 1.5h4.19q.3 0 .57-.12c.19-.07.35-.18.49-.32l11.56-11.56c.14-.14.25-.31.33-.49.07-.18.11-.38.11-.57 0-.2-.04-.4-.11-.58-.08-.18-.19-.35-.33-.49m-16.5 8.13 8.47-8.47 1.56 1.56-8.46 8.47zm-.31 1.81 2.69 2.69h-2.69zm4.5 2.38-1.56-1.57 8.47-8.47 1.56 1.57z" /></Svg>;
export { SolidPencil as ReactComponent };
