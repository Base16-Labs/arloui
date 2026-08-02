import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSimCard = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.031 7.72-5.25-5.25a.8.8 0 0 0-.244-.17 1 1 0 0 0-.287-.05h-9c-.398 0-.779.15-1.061.44-.281.28-.439.66-.439 1.06v16.5c0 .39.158.78.439 1.06s.663.44 1.061.44h13.5c.398 0 .779-.16 1.061-.44s.439-.67.439-1.06v-12a.75.75 0 0 0-.219-.53M17.25 18a.751.751 0 0 1-.75.75H15a.376.376 0 0 1-.375-.38v-3.35a.75.75 0 0 0-.198-.52.71.71 0 0 0-.502-.25.8.8 0 0 0-.303.04.9.9 0 0 0-.26.16.7.7 0 0 0-.176.25c-.04.09-.061.2-.061.3v3.37a.376.376 0 0 1-.375.38h-1.5a.376.376 0 0 1-.375-.38v-3.35a.75.75 0 0 0-.198-.52.71.71 0 0 0-.502-.25.8.8 0 0 0-.303.04.9.9 0 0 0-.26.16.7.7 0 0 0-.176.25c-.04.09-.061.2-.061.3v3.37a.376.376 0 0 1-.375.38H7.5a.75.75 0 0 1-.75-.75v-5.25A.751.751 0 0 1 7.5 12h9a.75.75 0 0 1 .75.75z" /></Svg>;
export { SolidSimCard as ReactComponent };
export { SolidSimCard };
export default SolidSimCard;
