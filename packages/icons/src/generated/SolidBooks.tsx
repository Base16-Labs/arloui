import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidBooks = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m20.97 18.616-3.12-14.8a1.6 1.6 0 0 0-.22-.54c-.12-.16-.26-.3-.42-.41-.17-.11-.36-.18-.55-.22-.19-.03-.39-.03-.59.01l-4.38.94c-.39.09-.73.32-.95.66-.21.33-.29.74-.21 1.13l3.11 14.79c.07.34.26.64.52.86.27.22.6.34.95.34.1 0 .21-.01.31-.04l4.39-.94c.39-.08.73-.32.95-.65.21-.34.29-.74.21-1.13M12 5.076v-.01l4.39-.94.31 1.49-4.39.94zm.94 4.44-.32-1.49 4.39-.94.32 1.49zm6.56 9.41-4.39.94-.31-1.49 4.39-.94zM9 3.376H4.5a1.5 1.5 0 0 0-1.5 1.5v15a1.5 1.5 0 0 0 1.5 1.5H9a1.5 1.5 0 0 0 1.5-1.5v-15a1.5 1.5 0 0 0-1.5-1.5m-4.5 1.5H9v1.5H4.5zm4.5 15H4.5v-1.5H9z" /></Svg>;
export { SolidBooks as ReactComponent };
