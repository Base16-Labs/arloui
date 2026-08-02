import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineJoystick = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M19.5 14.25h-6.75V9.67c.91-.19 1.72-.7 2.27-1.45s.81-1.68.71-2.6a3.74 3.74 0 0 0-1.21-2.41A3.77 3.77 0 0 0 12 2.25c-.93 0-1.82.34-2.51.96-.69.63-1.12 1.48-1.22 2.41-.09.92.16 1.85.71 2.6s1.36 1.26 2.27 1.45v4.58H4.5c-.4 0-.78.15-1.06.44-.28.28-.44.66-.44 1.06v4.5a1.499 1.499 0 0 0 1.5 1.5h15a1.5 1.5 0 0 0 1.5-1.5v-4.5c0-.4-.16-.78-.44-1.06-.28-.29-.66-.44-1.06-.44M9.75 6c0-.45.13-.88.38-1.25s.6-.66 1.01-.83.87-.22 1.3-.13c.44.09.84.3 1.15.61.32.32.53.72.62 1.16.09.43.04.89-.13 1.3s-.46.76-.83 1.01c-.37.24-.8.38-1.25.38-.59 0-1.17-.24-1.59-.66-.42-.43-.66-1-.66-1.59m9.75 14.25h-15v-4.5h15zm-3.75-9h3c.2 0 .39.07.53.22a.75.75 0 0 1-.53 1.28h-3a.75.75 0 0 1-.53-1.28.7.7 0 0 1 .53-.22" /></Svg>;
export { OutlineJoystick as ReactComponent };
export { OutlineJoystick };
export default OutlineJoystick;
