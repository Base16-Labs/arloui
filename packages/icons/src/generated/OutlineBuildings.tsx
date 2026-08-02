import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBuildings = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.5 20.25H21V9.75c0-.4-.158-.78-.439-1.06a1.5 1.5 0 0 0-1.061-.44h-6v-4.5c0-.27-.073-.54-.213-.77-.139-.24-.34-.43-.579-.56a1.6 1.6 0 0 0-.781-.17c-.271.01-.534.1-.759.25l-7.5 5A1.5 1.5 0 0 0 3 8.75v11.5H1.5a.751.751 0 0 0 0 1.5h21a.751.751 0 0 0 0-1.5m-3-10.5v10.5h-6V9.75zm-15-1 7.5-5v16.5H4.5zm6 2.5v1.5a.751.751 0 0 1-1.5 0v-1.5a.751.751 0 0 1 1.5 0m-3 0v1.5a.751.751 0 0 1-1.5 0v-1.5a.751.751 0 0 1 1.5 0m0 5.25V18A.751.751 0 0 1 6 18v-1.5a.751.751 0 0 1 1.5 0m3 0V18A.751.751 0 0 1 9 18v-1.5a.751.751 0 0 1 1.5 0" /></Svg>;
export { OutlineBuildings as ReactComponent };
export { OutlineBuildings };
export default OutlineBuildings;
