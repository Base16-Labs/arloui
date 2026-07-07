import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineMetronome = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M17.54 10.76 20.05 8c.14-.15.2-.34.19-.54a.77.77 0 0 0-.24-.51.82.82 0 0 0-.54-.2c-.19.01-.38.1-.52.24l-1.92 2.12-1.61-5.07c-.1-.3-.29-.57-.55-.76-.25-.18-.57-.28-.88-.28h-3.96c-.32 0-.63.1-.88.28-.26.19-.45.46-.55.76l-4.77 15a1.5 1.5 0 0 0 .22 1.34c.14.19.32.35.53.45.21.11.44.17.68.17h13.5c.24 0 .47-.06.68-.17.21-.1.39-.26.53-.45s.23-.41.27-.64c.04-.24.02-.47-.05-.7zM17.32 15h-3.63l2.69-2.95zm-7.3-10.5h3.96l1.87 5.89L11.67 15H6.68zm-4.77 15 .95-3h11.59l.96 3z" /></Svg>;
export { OutlineMetronome as ReactComponent };
