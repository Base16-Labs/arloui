import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const SolidNut = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="m20.97 6.205-8.25-4.52c-.22-.12-.468-.18-.72-.18s-.5.06-.72.18l-8.25 4.52a1.51 1.51 0 0 0-.78 1.31v8.97a1.51 1.51 0 0 0 .78 1.31l8.25 4.52c.22.12.468.18.72.18s.5-.06.72-.18l8.25-4.52a1.51 1.51 0 0 0 .78-1.31v-8.97c0-.27-.073-.53-.21-.76a1.5 1.5 0 0 0-.57-.55M12 15.755c-.742 0-1.467-.22-2.083-.64a3.7 3.7 0 0 1-1.382-1.68 3.76 3.76 0 0 1-.213-2.17c.145-.72.502-1.39 1.026-1.92a3.74 3.74 0 0 1 1.92-1.02 3.74 3.74 0 0 1 2.167.21c.685.29 1.271.77 1.683 1.38a3.76 3.76 0 0 1-.466 4.74c-.704.7-1.657 1.1-2.652 1.1" /></Svg>;
export { SolidNut as ReactComponent };
