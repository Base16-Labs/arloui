import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidFileImage = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M16 20.59a.75.75 0 0 1-.239 1.06.74.74 0 0 1-.386.1h-12a.73.73 0 0 1-.659-.39.76.76 0 0 1-.09-.39.7.7 0 0 1 .118-.37l3.375-5.25A.73.73 0 0 1 6.75 15a.736.736 0 0 1 .631.35l.915 1.42 1.954-2.93a.7.7 0 0 1 .271-.25.733.733 0 0 1 .708 0c.11.06.202.14.27.25zm5.375-12.34v12a1.504 1.504 0 0 1-1.5 1.5h-.75a.748.748 0 0 1-.531-1.28.76.76 0 0 1 .531-.22h.75V9h-4.5a.748.748 0 0 1-.75-.75v-4.5h-8.25V12a.753.753 0 0 1-1.281.53.75.75 0 0 1-.219-.53V3.75a1.506 1.506 0 0 1 1.5-1.5h9q.149 0 .287.06c.091.04.174.09.243.16l5.25 5.25q.106.105.163.24c.038.1.057.19.057.29m-5.25-.75h2.69l-2.69-2.69z" /></Svg>;
export { SolidFileImage as ReactComponent };
