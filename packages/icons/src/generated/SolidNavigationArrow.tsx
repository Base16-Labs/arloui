import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNavigationArrow = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.746 9.894c-.002.32-.106.63-.297.88-.191.26-.458.44-.761.53l-.02.01-7.312 2.04-2.047 7.32-.006.02a1.46 1.46 0 0 1-1.406 1.05h-.028c-.311.01-.615-.09-.868-.27a1.45 1.45 0 0 1-.545-.73L2.34 4.254c-.002 0-.004-.01-.005-.01a1.5 1.5 0 0 1-.043-.83c.063-.27.2-.52.399-.72s.449-.34.722-.4c.274-.06.559-.05.825.04l.015.01 16.493 6.11c.298.11.556.3.736.56s.273.57.264.88" /></Svg>;
export { SolidNavigationArrow as ReactComponent };
export { SolidNavigationArrow };
export default SolidNavigationArrow;
