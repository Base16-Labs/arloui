import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBatteryWarningVertical = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M11.25 13.125v-3.75c0-.199.079-.39.22-.53a.747.747 0 0 1 1.06 0c.141.14.22.331.22.53v3.75c0 .199-.079.39-.22.53a.747.747 0 0 1-1.06 0 .75.75 0 0 1-.22-.53m.75 2.25a1.12 1.12 0 0 0-1.039.694 1.1 1.1 0 0 0-.064.65c.043.219.15.419.308.576a1.122 1.122 0 0 0 1.92-.795A1.127 1.127 0 0 0 12 15.375m-3-13.5h6c.199 0 .39-.079.53-.22a.747.747 0 0 0 0-1.06.75.75 0 0 0-.53-.22H9a.75.75 0 0 0-.53.22.747.747 0 0 0 0 1.06c.14.141.331.22.53.22m9.75 3.75v15.75a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25V5.625a2.25 2.25 0 0 1 2.25-2.25h9a2.25 2.25 0 0 1 2.25 2.25m-1.5 0a.75.75 0 0 0-.22-.53.75.75 0 0 0-.53-.22h-9a.75.75 0 0 0-.53.22.75.75 0 0 0-.22.53v15.75c0 .199.079.39.22.53.14.141.331.22.53.22h9c.199 0 .39-.079.53-.22a.75.75 0 0 0 .22-.53z" /></Svg>;
export { OutlineBatteryWarningVertical as ReactComponent };
export { OutlineBatteryWarningVertical };
export default OutlineBatteryWarningVertical;
