declare module 'react-dom' {
  export function createPortal(
    children: React.ReactNode,
    container: Element | DocumentFragment,
  ): React.ReactPortal;
}
