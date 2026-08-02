import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidSubway = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M14.625 17.25V15H16.5v1.5a.751.751 0 0 1-.75.75zm-1.5 0V15h-2.25v2.25zM16.5 9a.751.751 0 0 0-.75-.75h-7.5A.75.75 0 0 0 7.5 9v4.5h9zm-2.25-6h-4.5c-1.79 0-3.507.71-4.773 1.98A6.73 6.73 0 0 0 3 9.75v10.5a.751.751 0 0 0 .75.75h3.429c.07 0 .138-.02.198-.05a.37.37 0 0 0 .138-.16l1.022-2.04H8.25c-.597 0-1.169-.24-1.591-.66A2.24 2.24 0 0 1 6 16.5V9c0-.6.237-1.17.659-1.59s.994-.66 1.591-.66h7.5c.597 0 1.169.24 1.591.66S18 8.4 18 9v7.5c0 .6-.237 1.17-.659 1.59s-.994.66-1.591.66h-.287l1.022 2.04c.031.07.079.12.138.16.06.03.128.05.198.05h3.429a.75.75 0 0 0 .75-.75V9.75c0-1.79-.711-3.51-1.977-4.77A6.74 6.74 0 0 0 14.25 3m-.463 15.75h-3.574l-.853 1.71a.37.37 0 0 0 .016.36.392.392 0 0 0 .32.18h4.608a.39.39 0 0 0 .32-.18.367.367 0 0 0 .016-.36zM7.5 16.5a.751.751 0 0 0 .75.75h1.125V15H7.5z" /></Svg>;
export { SolidSubway as ReactComponent };
export { SolidSubway };
export default SolidSubway;
