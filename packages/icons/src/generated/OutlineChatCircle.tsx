import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineChatCircle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12.003 2.251c-1.683 0-3.338.43-4.803 1.26a9.7 9.7 0 0 0-3.557 3.47 9.753 9.753 0 0 0-.248 9.6l-1.064 3.19a1.51 1.51 0 0 0 .362 1.54c.197.19.445.33.716.4.272.06.555.05.82-.04l3.192-1.06a9.8 9.8 0 0 0 8.542.3 9.9 9.9 0 0 0 3.504-2.64 9.77 9.77 0 0 0 2.07-8.3 9.7 9.7 0 0 0-1.853-3.97 9.7 9.7 0 0 0-3.408-2.76 9.74 9.74 0 0 0-4.273-.99m0 18c-1.45 0-2.875-.38-4.13-1.11a.8.8 0 0 0-.3-.1.7.7 0 0 0-.314.04l-3.506 1.17 1.17-3.51a.75.75 0 0 0-.063-.61 8.24 8.24 0 0 1-1.039-5.2 8.24 8.24 0 0 1 2.343-4.76 8.23 8.23 0 0 1 4.756-2.35c1.801-.24 3.63.12 5.203 1.03a8.26 8.26 0 0 1 3.848 9.28 8.24 8.24 0 0 1-2.945 4.41 8.23 8.23 0 0 1-5.023 1.71" /></Svg>;
export { OutlineChatCircle as ReactComponent };
export { OutlineChatCircle };
export default OutlineChatCircle;
