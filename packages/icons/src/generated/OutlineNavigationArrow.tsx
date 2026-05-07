import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlineNavigationArrow = (props: SvgProps) => <Svg width={24} height={24} fill="none" {...props}><Path fill="currentColor" d="M20.75 8.449 4.255 2.339h-.015c-.265-.1-.55-.11-.825-.05-.273.06-.524.2-.722.4-.199.2-.338.45-.402.72-.064.28-.049.56.041.83.002 0 .003.01.005.01l6.118 16.5c.101.29.291.54.545.72s.557.28.868.28h.028c.317-.01.625-.11.878-.3s.438-.46.528-.76l.006-.02 2.048-7.31 7.312-2.05.02-.01c.3-.09.565-.27.755-.53.19-.25.296-.55.302-.87s-.086-.62-.266-.88a1.47 1.47 0 0 0-.734-.56zm-8.203 3.57a.8.8 0 0 0-.328.2.74.74 0 0 0-.192.32l-2.156 7.71-.006-.02L3.75 3.749l16.483 6.11.015.01z" /></Svg>;
export { OutlineNavigationArrow as ReactComponent };
