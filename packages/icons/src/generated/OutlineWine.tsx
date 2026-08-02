import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineWine = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m19.25 8.97-2.041-6.93a.75.75 0 0 0-.719-.54H7.51a.752.752 0 0 0-.719.54L4.75 8.97a5.93 5.93 0 0 0-.048 3.26 5.9 5.9 0 0 0 1.681 2.8 8.24 8.24 0 0 0 4.867 2.19V21h-3a.751.751 0 0 0 0 1.5h7.5a.751.751 0 0 0 0-1.5h-3v-3.78a8.23 8.23 0 0 0 4.866-2.19 5.9 5.9 0 0 0 1.682-2.8c.289-1.07.272-2.2-.048-3.26M8.071 3h7.858l1.883 6.39.024.09c-2.008.72-4.27-.15-5.497-.77-2.361-1.2-4.236-1.35-5.619-1.12zm8.523 10.94A6.75 6.75 0 0 1 12 15.75a6.75 6.75 0 0 1-4.594-1.81 4.475 4.475 0 0 1-1.219-4.55l.043-.14c1.125-.38 2.912-.48 5.431.8 1.045.52 2.733 1.2 4.54 1.2.604 0 1.205-.08 1.786-.24a4.46 4.46 0 0 1-1.393 2.93" /></Svg>;
export { OutlineWine as ReactComponent };
export { OutlineWine };
export default OutlineWine;
