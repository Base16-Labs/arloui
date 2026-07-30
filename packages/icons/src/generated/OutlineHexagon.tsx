import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineHexagon = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.97 6.205-8.25-4.52c-.22-.12-.468-.18-.72-.18s-.5.06-.72.18l-8.25 4.52a1.51 1.51 0 0 0-.78 1.31v8.97a1.51 1.51 0 0 0 .78 1.31l8.25 4.52c.22.12.468.18.72.18s.5-.06.72-.18l8.25-4.52a1.51 1.51 0 0 0 .78-1.31v-8.97c0-.27-.073-.53-.21-.76a1.5 1.5 0 0 0-.57-.55m-.72 10.28L12 21.005l-8.25-4.52v-8.97L12 3.005l8.25 4.51z" /></Svg>;
export { OutlineHexagon as ReactComponent };
