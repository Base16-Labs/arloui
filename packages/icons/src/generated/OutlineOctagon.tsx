import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineOctagon = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m21.31 7.52-4.832-4.83a1.6 1.6 0 0 0-.487-.33 1.4 1.4 0 0 0-.574-.11H8.583c-.197 0-.392.03-.574.11a1.6 1.6 0 0 0-.486.33L2.69 7.52q-.212.21-.327.48c-.075.19-.114.38-.113.58v6.83c-.001.2.038.4.113.58q.115.27.327.48l4.833 4.84c.138.14.303.25.486.32.182.08.377.12.574.12h6.834c.197 0 .392-.04.574-.12.183-.07.348-.18.487-.32l4.832-4.84q.211-.21.327-.48c.075-.18.114-.38.113-.58V8.58c.001-.2-.038-.39-.113-.58a1.5 1.5 0 0 0-.327-.48m-1.06 7.89-4.833 4.84H8.583L3.75 15.41V8.58l4.833-4.83h6.834l4.833 4.83z" /></Svg>;
export { OutlineOctagon as ReactComponent };
