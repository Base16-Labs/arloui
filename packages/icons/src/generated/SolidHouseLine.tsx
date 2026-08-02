import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidHouseLine = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 19.875H21v-6.75l.22.22c.14.14.33.21.53.21s.39-.07.53-.22a.75.75 0 0 0 0-1.06l-9.22-9.22a1.5 1.5 0 0 0-1.06-.43c-.4 0-.78.15-1.06.43l-9.22 9.22a.75.75 0 1 0 1.06 1.06l.22-.21v6.75H1.5c-.2 0-.39.07-.53.22a.75.75 0 0 0 .53 1.28h21a.75.75 0 0 0 .53-1.28.7.7 0 0 0-.53-.22m-8.25 0h-4.5v-4.5c0-.1.04-.2.11-.27s.17-.11.27-.11h3.75c.1 0 .19.04.26.11s.11.17.11.27z" /></Svg>;
export { SolidHouseLine as ReactComponent };
export { SolidHouseLine };
export default SolidHouseLine;
