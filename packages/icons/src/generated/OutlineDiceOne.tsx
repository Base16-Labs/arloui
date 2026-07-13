import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineDiceOne = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M18 3H6a3 3 0 0 0-2.121.88A2.98 2.98 0 0 0 3 6v12a3 3 0 0 0 3 3h12a3 3 0 0 0 3-3V6c0-.8-.316-1.56-.879-2.12A3 3 0 0 0 18 3m1.5 15c0 .4-.158.78-.439 1.06s-.663.44-1.061.44H6c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 4.5 18V6c0-.4.158-.78.439-1.06S5.602 4.5 6 4.5h12c.398 0 .779.16 1.061.44S19.5 5.6 19.5 6zm-6.375-6c0 .22-.066.44-.19.62-.123.19-.299.33-.504.42-.206.08-.432.11-.65.06a1.1 1.1 0 0 1-.576-.31 1.07 1.07 0 0 1-.308-.57c-.044-.22-.022-.45.064-.65.085-.21.229-.38.414-.51.185-.12.402-.19.625-.19A1.127 1.127 0 0 1 13.125 12" /></Svg>;
export { OutlineDiceOne as ReactComponent };
