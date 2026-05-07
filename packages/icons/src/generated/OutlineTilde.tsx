import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTilde = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.81 12.246c-1.36 1.68-2.704 2.58-4.106 2.73-.14.01-.281.02-.422.02-1.81 0-3.318-1.23-4.781-2.42-1.398-1.13-2.72-2.21-4.097-2.06-.985.1-1.998.82-3.094 2.18a.7.7 0 0 1-.497.25.73.73 0 0 1-.531-.16.74.74 0 0 1-.14-1.02c1.36-1.69 2.704-2.59 4.106-2.74 1.999-.21 3.627 1.12 5.2 2.4 1.399 1.14 2.72 2.21 4.098 2.06.986-.1 1.998-.82 3.094-2.18a.8.8 0 0 1 .222-.21 1 1 0 0 1 .286-.1.8.8 0 0 1 .302.02c.098.03.189.08.269.14a.747.747 0 0 1 .241.82.8.8 0 0 1-.152.27z" /></Svg>;
export { OutlineTilde as ReactComponent };
