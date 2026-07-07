import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidHexagon = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 7.515v8.97a1.51 1.51 0 0 1-.78 1.31l-8.25 4.52c-.22.12-.468.18-.72.18s-.5-.06-.72-.18l-8.25-4.52a1.51 1.51 0 0 1-.78-1.31v-8.97a1.51 1.51 0 0 1 .78-1.31l8.25-4.52c.22-.12.468-.18.72-.18s.5.06.72.18l8.25 4.52a1.51 1.51 0 0 1 .78 1.31" /></Svg>;
export { SolidHexagon as ReactComponent };
