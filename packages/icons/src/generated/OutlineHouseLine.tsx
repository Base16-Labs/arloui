import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineHouseLine = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 19.875H21v-6.75l.22.22c.14.14.33.21.53.21s.39-.07.53-.22a.75.75 0 0 0 0-1.06l-9.22-9.22a1.5 1.5 0 0 0-1.06-.43c-.398 0-.778.15-1.06.43l-9.22 9.22a.75.75 0 0 0 0 1.06.75.75 0 0 0 1.062 0l.219-.21v6.75H1.5c-.2 0-.39.07-.53.22a.745.745 0 0 0 0 1.06c.14.14.33.22.53.22H22.5a.75.75 0 0 0 .53-1.28.7.7 0 0 0-.53-.22m-18-8.25 7.5-7.5 7.5 7.5v8.25H15v-5.25c0-.2-.079-.39-.22-.53a.71.71 0 0 0-.53-.22h-4.5c-.198 0-.39.07-.53.22a.75.75 0 0 0-.22.53v5.25H4.5zm9 8.25h-3v-4.5h3z" /></Svg>;
export { OutlineHouseLine as ReactComponent };
