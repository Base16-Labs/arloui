import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPentagon = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m21.68 10.61-3 10.08-.005.02c-.097.3-.287.56-.543.75s-.565.29-.882.29H6.75a1.507 1.507 0 0 1-1.425-1.04l-.006-.02-3-10.08a1.517 1.517 0 0 1 .535-1.66l8.242-6.4.017-.01c.257-.19.568-.29.887-.29s.63.1.887.29l.017.01 8.242 6.4a1.52 1.52 0 0 1 .534 1.66" /></Svg>;
export { SolidPentagon as ReactComponent };
