import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidCursor = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m20.669 19.479-1.19 1.19c-.1.11-.23.19-.36.25-.14.05-.29.08-.44.08-.14 0-.29-.03-.43-.08-.13-.06-.26-.14-.36-.25l-5.31-5.3-1.8 4.7-.01.03c-.12.27-.31.5-.55.66s-.53.24-.82.24h-.07c-.31-.01-.6-.12-.84-.3a1.5 1.5 0 0 1-.51-.73l-4.9-15.01c-.09-.26-.1-.54-.04-.81.07-.27.2-.51.4-.71.19-.19.44-.33.71-.4.27-.06.55-.05.81.04l15.01 4.9c.29.09.54.27.72.51.18.25.29.54.3.84.02.3-.06.6-.22.86s-.39.46-.67.58l-.03.01-4.7 1.81 5.3 5.3c.21.21.33.5.33.8s-.12.58-.33.79" /></Svg>;
export { SolidCursor as ReactComponent };
