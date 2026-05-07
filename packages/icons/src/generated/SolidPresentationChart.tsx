import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPresentationChart = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.25 4.126h-7.5v-1.5a.75.75 0 0 0-1.5 0v1.5h-7.5a1.5 1.5 0 0 0-1.5 1.5v11.25a1.5 1.5 0 0 0 1.5 1.5h3.69l-2.03 2.53c-.12.15-.18.35-.16.55.03.2.13.38.28.5.16.13.36.19.55.16.2-.02.38-.12.51-.27l2.77-3.47h5.28l2.77 3.47c.07.07.14.14.23.19.08.04.18.07.28.08s.19.01.29-.02c.09-.03.18-.07.26-.14.08-.06.14-.13.19-.22.04-.09.07-.18.09-.28.01-.1 0-.2-.03-.29a.8.8 0 0 0-.13-.26l-2.03-2.53h3.69a1.5 1.5 0 0 0 1.5-1.5V5.626a1.5 1.5 0 0 0-1.5-1.5m-10.5 9.75a.75.75 0 0 1-1.5 0v-2.25a.75.75 0 0 1 1.5 0zm3 0a.75.75 0 0 1-1.5 0v-3.75a.75.75 0 0 1 1.5 0zm3 0a.75.75 0 0 1-1.5 0v-5.25a.75.75 0 0 1 1.5 0z" /></Svg>;
export { SolidPresentationChart as ReactComponent };
