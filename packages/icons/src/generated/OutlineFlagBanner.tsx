import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineFlagBanner = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.636 3.715a.7.7 0 0 0-.27-.25.7.7 0 0 0-.36-.1h-18c-.15 0-.3.05-.42.13s-.22.2-.28.33c-.05.14-.07.29-.04.44.03.14.1.28.21.38l3.97 3.97-3.97 3.97q-.165.165-.21.39c-.03.14-.01.29.04.43.06.14.16.25.28.34.12.08.27.12.42.12h12.52l-2.7 5.68a.74.74 0 0 0-.04.58c.03.1.08.18.15.26.06.07.15.13.24.18.09.04.18.06.28.07a.8.8 0 0 0 .55-.2c.07-.07.13-.15.17-.25l7.5-15.75c.06-.11.08-.24.07-.36 0-.13-.04-.25-.11-.36m-5.39 8.65H4.816l3.22-3.22a.78.78 0 0 0 .22-.53.75.75 0 0 0-.22-.53l-3.22-3.22h15z" /></Svg>;
export { OutlineFlagBanner as ReactComponent };
