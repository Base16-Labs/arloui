import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePackage = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m20.97 6.205-8.25-4.52c-.22-.12-.47-.18-.72-.18s-.5.06-.72.18l-8.25 4.52a1.5 1.5 0 0 0-.78 1.31v8.97a1.506 1.506 0 0 0 .78 1.31l8.25 4.52c.22.12.47.18.72.18s.5-.06.72-.18l8.25-4.52a1.5 1.5 0 0 0 .78-1.31v-8.97a1.506 1.506 0 0 0-.78-1.31M12 3.005l7.53 4.12-2.79 1.53-7.53-4.13zm0 8.25-7.53-4.13 3.18-1.74 7.53 4.13zm-8.25-2.82 7.5 4.11v8.04l-7.5-4.1zm16.5 8.05-7.5 4.1v-8.04l3-1.64v3.35a.75.75 0 0 0 1.5 0v-4.17l3-1.65v8.05" /></Svg>;
export { OutlinePackage as ReactComponent };
