import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSteeringWheel = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M12 2.25a9.76 9.76 0 0 0-5.417 1.64 9.8 9.8 0 0 0-3.59 4.38 9.74 9.74 0 0 0-.556 5.63 9.8 9.8 0 0 0 2.67 5 9.7 9.7 0 0 0 4.991 2.66c1.891.38 3.852.19 5.633-.55a9.8 9.8 0 0 0 4.376-3.59A9.78 9.78 0 0 0 21.75 12a9.77 9.77 0 0 0-2.859-6.89 9.74 9.74 0 0 0-6.89-2.86m-7.347 13.5H8.48l1.593 4.27a8.2 8.2 0 0 1-3.176-1.54 8.3 8.3 0 0 1-2.244-2.73M12 14.63c-.297 0-.587-.09-.833-.26a1.49 1.49 0 0 1-.228-2.3c.21-.21.477-.36.768-.41.291-.06.593-.03.867.08s.508.31.673.55a1.51 1.51 0 0 1-.186 1.9c-.282.28-.663.44-1.06.44m1.918 5.4 1.602-4.28h3.827a8.32 8.32 0 0 1-5.429 4.28M12 9c-3.022 0-5.945 1.08-8.25 3.03V12c0-2.19.87-4.29 2.416-5.83a8.244 8.244 0 0 1 11.668 0A8.23 8.23 0 0 1 20.25 12v.03A12.78 12.78 0 0 0 12 9" /></Svg>;
export { SolidSteeringWheel as ReactComponent };
export { SolidSteeringWheel };
export default SolidSteeringWheel;
