import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineTagChevron = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="m22.375 11.59-4.28-6.42a1.5 1.5 0 0 0-.54-.49c-.216-.12-.46-.18-.705-.18H2.25a.75.75 0 0 0-.661.4.75.75 0 0 0 .038.77L5.85 12l-4.22 6.34a.73.73 0 0 0-.037.76.747.747 0 0 0 .658.4H16.85c.246 0 .489-.06.706-.18.217-.11.402-.28.539-.49l4.278-6.41a.75.75 0 0 0 .002-.83M16.85 18H3.657l3.723-5.58a.75.75 0 0 0 0-.83L3.657 6H16.85l4 6z" /></Svg>;
export { OutlineTagChevron as ReactComponent };
