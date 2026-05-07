import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPerspective = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M23.25 12.753a.751.751 0 0 1-.75.75H21v6c0 .39-.158.78-.439 1.06s-.663.44-1.061.44q-.135 0-.269-.03l-15-2.73a1.48 1.48 0 0 1-.883-.51 1.5 1.5 0 0 1-.348-.96v-3.27H1.5a.751.751 0 0 1 0-1.5h21a.75.75 0 0 1 .75.75m-19.875-2.25h17.25a.376.376 0 0 0 .375-.38v-5.58c.005-.39-.13-.76-.382-1.04a1.5 1.5 0 0 0-.631-.42 1.4 1.4 0 0 0-.755-.06l-15 2.73A1.496 1.496 0 0 0 3 7.223v2.9a.376.376 0 0 0 .375.38" /></Svg>;
export { SolidPerspective as ReactComponent };
