import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineDownload = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.5 13.875v6a1.5 1.5 0 0 1-1.5 1.5H3a1.5 1.5 0 0 1-1.5-1.5v-6a1.5 1.5 0 0 1 1.5-1.5h3.75a.75.75 0 0 1 0 1.5H3v6h18v-6h-3.75a.75.75 0 0 1 0-1.5H21a1.5 1.5 0 0 1 1.5 1.5m-11.03-.22a.78.78 0 0 0 .53.22c.1 0 .19-.02.28-.06.1-.04.18-.09.25-.16l4.5-4.5a.75.75 0 1 0-1.06-1.06l-3.22 3.22v-7.94a.75.75 0 0 0-1.5 0v7.94l-3.22-3.22a.75.75 0 1 0-1.06 1.06zm7.28 3.22c0-.22-.07-.44-.19-.63-.13-.18-.3-.32-.51-.41-.2-.09-.43-.11-.65-.06-.22.04-.42.15-.57.3a1.1 1.1 0 0 0-.31.58c-.04.22-.02.44.06.65.09.21.23.38.42.5.18.13.4.19.62.19.3 0 .59-.11.8-.33.21-.21.33-.49.33-.79" /></Svg>;
export { OutlineDownload as ReactComponent };
