import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidPaperPlane = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.14 20.84c-.14.17-.31.3-.51.4-.2.09-.41.14-.63.14-.17 0-.34-.03-.5-.09L13 18.76a.36.36 0 0 1-.18-.14.34.34 0 0 1-.07-.22v-6.77c0-.11-.02-.21-.07-.3a.74.74 0 0 0-.43-.41c-.1-.04-.2-.05-.3-.04-.2.01-.38.1-.51.25-.13.14-.2.33-.19.52v6.75c0 .08-.03.16-.07.22a.45.45 0 0 1-.19.14L3.5 21.29c-.29.1-.6.11-.9.03-.29-.08-.55-.25-.75-.48-.2-.24-.32-.52-.34-.83-.03-.3.03-.61.18-.87l9-15.75c.13-.23.32-.43.55-.56.23-.14.49-.21.75-.21.27 0 .53.07.76.21.23.13.42.33.55.56l9 15.75c.16.26.22.57.19.87-.03.31-.15.6-.35.83" /></Svg>;
export { SolidPaperPlane as ReactComponent };
