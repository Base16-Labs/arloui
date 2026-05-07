import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineBookOpen = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M21.75 3H15a3.714 3.714 0 0 0-3 1.5A3.71 3.71 0 0 0 9 3H2.25a.75.75 0 0 0-.75.75v13.5a.751.751 0 0 0 .75.75H9c.597 0 1.169.23 1.591.66.422.42.659.99.659 1.59a.751.751 0 0 0 1.5 0c0-.6.237-1.17.659-1.59.422-.43.994-.66 1.591-.66h6.75a.75.75 0 0 0 .75-.75V3.75a.751.751 0 0 0-.75-.75M9 16.5H3v-12h6c.597 0 1.169.23 1.591.66.422.42.659.99.659 1.59v10.5A3.73 3.73 0 0 0 9 16.5m12 0h-6c-.812 0-1.601.26-2.25.75V6.75c0-.6.237-1.17.659-1.59.422-.43.994-.66 1.591-.66h6z" /></Svg>;
export { OutlineBookOpen as ReactComponent };
