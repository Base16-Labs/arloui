import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePill = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.267 3.735a4.97 4.97 0 0 0-3.53-1.46c-1.325 0-2.595.52-3.531 1.46l-9.516 9.51a5 5 0 0 0 .045 7.02 4.993 4.993 0 0 0 7.017.04l9.516-9.51a4.997 4.997 0 0 0-.001-7.06M9.69 19.245a3.48 3.48 0 0 1-4.94 0 3.48 3.48 0 0 1-1.023-2.47c0-.92.368-1.81 1.023-2.47l4.227-4.22 4.94 4.94zm9.516-9.51-4.23 4.23-4.938-4.94 4.228-4.23c.658-.64 1.542-1 2.462-1a3.52 3.52 0 0 1 2.449 1.03 3.49 3.49 0 0 1 .029 4.91m-1.447-1.99q.105.105.163.24a.75.75 0 0 1-.163.82l-2.25 2.25a.77.77 0 0 1-.53.22.766.766 0 0 1-.53-.22.8.8 0 0 1-.22-.53c0-.1.02-.2.057-.29a.8.8 0 0 1 .163-.24l2.25-2.25a.71.71 0 0 1 .53-.22c.199 0 .39.07.53.22" /></Svg>;
export { OutlinePill as ReactComponent };
export { OutlinePill };
export default OutlinePill;
