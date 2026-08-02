import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPrescription = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 11.25H9v-4.5h3c.597 0 1.169.24 1.591.66s.659.99.659 1.59A2.256 2.256 0 0 1 12 11.25m9-6.75v15c0 .4-.158.78-.439 1.06s-.663.44-1.061.44h-15c-.398 0-.779-.16-1.061-.44A1.5 1.5 0 0 1 3 19.5v-15c0-.4.158-.78.439-1.06S4.102 3 4.5 3h15c.398 0 .779.16 1.061.44S21 4.1 21 4.5m-3.219 12.97-1.346-1.35 1.346-1.34a.75.75 0 0 0 0-1.06.755.755 0 0 0-1.062 0l-1.344 1.34-2.437-2.43c.88-.24 1.646-.78 2.156-1.53a3.76 3.76 0 0 0-.624-4.91c-.682-.6-1.56-.94-2.47-.94H8.25A.75.75 0 0 0 7.5 6v10.5a.751.751 0 0 0 1.5 0v-3.75h1.94l3.375 3.37-1.346 1.35a.75.75 0 0 0 0 1.06.755.755 0 0 0 1.062 0l1.344-1.35 1.344 1.35a.78.78 0 0 0 .531.22.782.782 0 0 0 .531-.22.75.75 0 0 0 0-1.06" /></Svg>;
export { SolidPrescription as ReactComponent };
export { SolidPrescription };
export default SolidPrescription;
