import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBird = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m22.54 7.624-2.178-1.451a5.63 5.63 0 0 0-5.364-3.924h-.027c-3.086.015-5.598 2.575-5.598 5.708v1.851L1.463 19.3l-.009.011a1.514 1.514 0 0 0-.182 1.59 1.503 1.503 0 0 0 1.351.85h8.25a9.76 9.76 0 0 0 9.75-9.752V10.15l1.916-1.277a.75.75 0 0 0 0-1.249M12.2 13.229l-5.625 6.752a.76.76 0 0 1-.805.25.8.8 0 0 1-.26-.14.8.8 0 0 1-.187-.24.752.752 0 0 1 .099-.832l5.625-6.75a.76.76 0 0 1 .511-.278.75.75 0 0 1 .642 1.238m3.548-4.98a1.123 1.123 0 0 1-1.103-1.345 1.128 1.128 0 0 1 1.534-.82 1.12 1.12 0 0 1 .694 1.04 1.124 1.124 0 0 1-1.125 1.125" /></Svg>;
export { SolidBird as ReactComponent };
export { SolidBird };
export default SolidBird;
