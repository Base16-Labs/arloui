import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFilmStrip = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75c-.398 0-.78.16-1.06.44-.282.28-.44.66-.44 1.06v13.5a1.506 1.506 0 0 0 1.5 1.5h16.5c.398 0 .779-.16 1.061-.44s.439-.66.439-1.06V5.25c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44m-3 1.5h3v1.5h-3zm-10.5 13.5h-3v-1.5h3zm0-12h-3v-1.5h3zm4.5 12h-3v-1.5h3zm0-12h-3v-1.5h3zm4.5 12h-3v-1.5h3zm0-12h-3v-1.5h3zm4.5 12h-3v-1.5h3z" /></Svg>;
export { SolidFilmStrip as ReactComponent };
