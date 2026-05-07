import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidWaveSawtooth = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 3.75H3.75a1.5 1.5 0 0 0-1.5 1.5v13.5a1.5 1.5 0 0 0 1.5 1.5h16.5a1.5 1.5 0 0 0 1.5-1.5V5.25a1.5 1.5 0 0 0-1.5-1.5m-1.08 8.88-6.75 4.5q-.195.12-.42.12a.75.75 0 0 1-.75-.75V8.91l-5.58 3.72c-.09.05-.18.09-.27.11q-.15.03-.3 0a.7.7 0 0 1-.27-.12.6.6 0 0 1-.2-.2.8.8 0 0 1-.12-.27q-.03-.15 0-.3.03-.135.12-.27c.05-.08.12-.15.2-.2l6.75-4.5c.12-.08.25-.12.38-.13q.21-.015.39.09c.12.06.22.16.29.28.07.11.11.24.11.38v7.6l5.58-3.72c.17-.11.37-.15.57-.12.19.04.36.16.47.32.11.17.15.37.12.57-.04.19-.16.36-.32.48" /></Svg>;
export { SolidWaveSawtooth as ReactComponent };
