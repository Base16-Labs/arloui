import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTriangle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.2 18.015 14 3.775c-.2-.35-.5-.64-.85-.84s-.75-.31-1.15-.31-.8.11-1.15.31-.65.49-.85.84l-8.2 14.24c-.2.33-.3.72-.3 1.11s.1.77.3 1.11c.2.35.49.64.85.84.35.2.75.31 1.15.3h16.4c.4.01.8-.1 1.15-.3s.65-.49.85-.84c.2-.34.3-.72.3-1.11s-.1-.78-.3-1.11m-1.3 1.47c-.07.12-.17.22-.3.29-.12.07-.26.1-.4.1H3.8c-.14 0-.28-.03-.4-.1a.76.76 0 0 1-.4-.65c0-.13.04-.26.1-.36l8.2-14.24c.07-.12.17-.22.3-.29.12-.07.26-.11.4-.11s.28.04.41.11c.12.07.22.17.3.29l8.19 14.24c.07.1.1.23.1.36 0 .12-.03.25-.1.36" /></Svg>;
export { OutlineTriangle as ReactComponent };
export { OutlineTriangle };
export default OutlineTriangle;
