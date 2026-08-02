import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineVignette = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m0 15H3.75V5.25h16.5zM16.69 8.22c-1.26-.95-2.93-1.47-4.69-1.47s-3.43.52-4.69 1.47c-1.33.99-2.06 2.34-2.06 3.78s.73 2.79 2.06 3.78c1.26.95 2.93 1.47 4.69 1.47s3.43-.52 4.69-1.47c1.33-.99 2.06-2.34 2.06-3.78s-.73-2.79-2.06-3.78M12 15.75c-2.89 0-5.25-1.68-5.25-3.75S9.11 8.25 12 8.25s5.25 1.68 5.25 3.75-2.36 3.75-5.25 3.75" /></Svg>;
export { OutlineVignette as ReactComponent };
export { OutlineVignette };
export default OutlineVignette;
