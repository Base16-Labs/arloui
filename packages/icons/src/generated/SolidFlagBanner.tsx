import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFlagBanner = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m21.676 4.435-4.27 8.99c-.01.01-.01.02-.02.03l-3.21 6.73c-.04.1-.1.18-.17.25a.8.8 0 0 1-.55.2.9.9 0 0 1-.28-.07.9.9 0 0 1-.24-.18.7.7 0 0 1-.15-.26.74.74 0 0 1 .04-.58l2.7-5.68H3.006c-.15 0-.3-.04-.42-.12a.84.84 0 0 1-.28-.34.8.8 0 0 1-.04-.43q.045-.225.21-.39l3.97-3.97-3.97-3.97a.72.72 0 0 1-.21-.38c-.03-.15-.01-.3.04-.44.06-.13.16-.25.28-.33s.27-.13.42-.13h18c.12 0 .25.03.36.1a.72.72 0 0 1 .38.61c.01.12-.01.25-.07.36" /></Svg>;
export { SolidFlagBanner as ReactComponent };
export { SolidFlagBanner };
export default SolidFlagBanner;
