import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSpade = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 13.125c0 .91-.24 1.81-.696 2.61a5.27 5.27 0 0 1-1.902 1.92c-.79.46-1.688.71-2.604.72a5.3 5.3 0 0 1-2.617-.67l1.037 3.45a.756.756 0 0 1-.381.89.8.8 0 0 1-.337.08h-4.5a.763.763 0 0 1-.602-.3.756.756 0 0 1-.116-.67l1.037-3.45c-.799.44-1.701.68-2.617.67a5.3 5.3 0 0 1-2.604-.72 5.27 5.27 0 0 1-1.902-1.92c-.456-.8-.696-1.7-.696-2.61 0-3 1.655-5.89 4.781-8.37a22 22 0 0 1 4.677-2.82.72.72 0 0 1 .578 0c1.672.74 3.246 1.69 4.683 2.82 3.126 2.48 4.781 5.37 4.781 8.37" /></Svg>;
export { SolidSpade as ReactComponent };
