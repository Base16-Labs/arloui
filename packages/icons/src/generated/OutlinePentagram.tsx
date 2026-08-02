import * as React from "react";
import Svg, { Path } from "react-native-svg";
import type { SvgProps } from "react-native-svg";
const OutlinePentagram = (props: SvgProps) => <Svg width={24} height={24} fill="none" viewBox="0 0 24 24" {...props}><Path fill="currentColor" d="M22.425 9.66c-.094-.3-.284-.56-.54-.75a1.4 1.4 0 0 0-.883-.28h-5.72l-1.852-5.7a1.488 1.488 0 0 0-1.426-1.05c-.32-.01-.63.1-.887.29-.258.19-.447.45-.542.76l-1.85 5.7H3.003c-.318 0-.628.1-.885.28-.257.19-.45.45-.546.75-.098.31-.097.63.002.94.1.3.292.56.55.74l4.638 3.34-1.776 5.48a1.458 1.458 0 0 0 .548 1.67c.255.19.563.29.88.29s.626-.1.88-.29l4.709-3.38 4.709 3.38a1.477 1.477 0 0 0 1.763 0c.256-.18.447-.45.545-.75s.098-.62 0-.92l-1.781-5.48 4.64-3.34c.259-.18.453-.45.55-.75.1-.3.099-.63-.003-.93M12.002 3.39 13.7 8.63h-3.398zm-9 6.74H8.24l-.991 3.05zm3.407 10.5 1.63-5.03 2.676 1.93zm2.116-6.53 1.292-3.97h4.37l1.289 3.97-3.474 2.49zm9.065 6.53-4.304-3.1 2.676-1.92zm-.838-7.45-.988-3.05h5.238z" /></Svg>;
export { OutlinePentagram as ReactComponent };
export { OutlinePentagram };
export default OutlinePentagram;
