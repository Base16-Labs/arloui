import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWaveTriangle = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m-.92 8.73-3.75 4.5c-.07.09-.16.15-.26.2s-.21.07-.32.07h-.04a.75.75 0 0 1-.33-.1.7.7 0 0 1-.25-.23L8.94 8.75l-3.11 3.73a.78.78 0 0 1-.51.27c-.2.02-.4-.05-.55-.17a.78.78 0 0 1-.27-.51c-.02-.2.05-.4.17-.55l3.75-4.5c.08-.09.17-.16.28-.21.11-.04.22-.06.34-.06.12.01.23.04.33.1s.19.14.25.23l5.45 8.17 3.1-3.73c.07-.08.14-.14.23-.18.09-.05.18-.08.28-.09s.2.01.29.03c.1.03.18.08.26.14.08.07.14.14.18.23a.7.7 0 0 1 .06.57c-.03.1-.08.18-.14.26" /></Svg>;
export { SolidWaveTriangle as ReactComponent };
