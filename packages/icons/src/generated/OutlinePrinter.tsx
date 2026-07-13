import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePrinter = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.13 6.75h-1.38v-3A.75.75 0 0 0 18 3H6a.75.75 0 0 0-.75.75v3H3.87C2.57 6.75 1.5 7.76 1.5 9v7.5a.75.75 0 0 0 .75.75h3v3A.75.75 0 0 0 6 21h12a.75.75 0 0 0 .75-.75v-3h3a.75.75 0 0 0 .75-.75V9c0-1.24-1.07-2.25-2.37-2.25M6.75 4.5h10.5v2.25H6.75zm10.5 15H6.75V15h10.5zM21 15.75h-2.25v-1.5a.75.75 0 0 0-.75-.75H6a.75.75 0 0 0-.75.75v1.5H3V9c0-.42.39-.75.87-.75h16.26c.48 0 .87.33.87.75zm-2.25-4.88c0 .23-.07.44-.19.63-.12.18-.3.33-.5.41-.21.09-.44.11-.65.07-.22-.05-.42-.15-.58-.31s-.26-.36-.31-.58c-.04-.22-.02-.44.07-.65.08-.2.22-.38.41-.5.18-.13.4-.19.62-.19.3 0 .59.12.8.33s.33.49.33.79" /></Svg>;
export { OutlinePrinter as ReactComponent };
