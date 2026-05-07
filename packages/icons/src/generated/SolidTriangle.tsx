import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidTriangle = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M22.2 20.235c-.2.35-.5.64-.85.84s-.75.31-1.15.3H3.8c-.4.01-.8-.1-1.15-.3s-.65-.49-.85-.84c-.2-.34-.3-.72-.3-1.11s.1-.78.3-1.11L10 3.775c.2-.35.5-.64.85-.84s.75-.31 1.15-.31.8.11 1.15.31.65.49.85.84l8.2 14.24c.2.33.3.72.3 1.11s-.1.77-.3 1.11" /></Svg>;
export { SolidTriangle as ReactComponent };
