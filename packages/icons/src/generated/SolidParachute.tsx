import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidParachute = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M21.75 11.625c0-2.59-1.03-5.07-2.86-6.89A9.75 9.75 0 0 0 12 1.875a9.75 9.75 0 0 0-6.89 2.86 9.72 9.72 0 0 0-2.86 6.89c0 .11.03.23.08.33.05.11.13.2.22.27l8.7 6.52v1.88h-.75a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-.75v-1.88l8.7-6.52c.09-.07.17-.16.22-.27.05-.1.08-.22.08-.33m-1.53-.75h-3.74c-.14-3.56-1.3-5.86-2.35-7.22 1.63.44 3.09 1.36 4.17 2.65a8.3 8.3 0 0 1 1.92 4.57m-5.75 1.5L12 16.825l-2.48-4.45zm-6.66 0 1.83 3.29-4.39-3.29zm8.38 0h2.56l-4.39 3.29zm-6.32-8.72c-1.05 1.36-2.21 3.66-2.35 7.22H3.78a8.3 8.3 0 0 1 1.92-4.57 8.23 8.23 0 0 1 4.17-2.65" /></Svg>;
export { SolidParachute as ReactComponent };
