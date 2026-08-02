import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidImage = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v13.5a1.499 1.499 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44m-5.62 4.5c.22 0 .44.06.62.19.19.12.33.29.42.5.08.21.1.43.06.65a1.1 1.1 0 0 1-.31.58c-.16.15-.36.26-.57.3-.22.05-.45.03-.65-.06-.21-.08-.39-.23-.51-.41-.12-.19-.19-.41-.19-.63 0-.3.12-.58.33-.79.21-.22.5-.33.8-.33m5.62 10.5H3.75v-3.69l4.35-4.34c.06-.07.15-.13.24-.17a.7.7 0 0 1 .29-.05.7.7 0 0 1 .53.22l6.31 6.31a.75.75 0 1 0 1.06-1.06l-1.65-1.66 1.34-1.34a.7.7 0 0 1 .53-.22c.2 0 .39.07.53.22l2.97 2.97z" /></Svg>;
export { SolidImage as ReactComponent };
export { SolidImage };
export default SolidImage;
