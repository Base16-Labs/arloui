import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFilmStrip = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.398 0-.78.16-1.06.44-.282.28-.44.66-.44 1.06v13.5a1.506 1.506 0 0 0 1.5 1.5h16.5c.398 0 .78-.16 1.06-.44.282-.28.44-.66.44-1.06V5.25a1.506 1.506 0 0 0-1.5-1.5m-16.5 4.5h7.5v7.5h-7.5zm9-1.5v-1.5h3v1.5zm-1.5 0h-3v-1.5h3zm0 10.5v1.5h-3v-1.5zm1.5 0h3v1.5h-3zm0-1.5v-7.5h7.5v7.5zm7.5-9h-3v-1.5h3zm-13.5-1.5v1.5h-3v-1.5zm-3 12h3v1.5h-3zm16.5 1.5h-3v-1.5h3z" /></Svg>;
export { OutlineFilmStrip as ReactComponent };
