import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePencilRuler = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M19.5 3.375H15c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v15a1.499 1.499 0 0 0 1.5 1.5h4.5a1.5 1.5 0 0 0 1.5-1.5v-15c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44m0 16.5H15v-3h2.25a.75.75 0 0 0 0-1.5H15v-2.25h2.25a.75.75 0 0 0 0-1.5H15v-2.25h2.25a.75.75 0 0 0 0-1.5H15v-3h4.5zM7.28 2.845a.8.8 0 0 0-.24-.17 1 1 0 0 0-.29-.05c-.1 0-.2.02-.29.05-.09.04-.17.1-.24.17l-3 3c-.07.07-.13.15-.16.24-.04.09-.06.19-.06.29v13.5a1.499 1.499 0 0 0 1.5 1.5H9a1.5 1.5 0 0 0 1.5-1.5v-13.5c0-.1-.02-.2-.06-.29a.6.6 0 0 0-.16-.24zM4.5 16.875v-9H6v9zm3-9H9v9H7.5zm-.75-3.44 1.94 1.94H4.81zM4.5 19.875v-1.5H9v1.5z" /></Svg>;
export { OutlinePencilRuler as ReactComponent };
