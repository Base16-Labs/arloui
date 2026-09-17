'use client';

import type { ReactNode, SVGProps } from 'react';

type SvgProps = SVGProps<SVGSVGElement> & {
  children?: ReactNode;
  accessibilityLabel?: string;
  accessibilityRole?: string;
  animatedProps?: SVGProps<SVGSVGElement>;
  originX?: number;
  originY?: number;
  rotation?: number;
};

export default function Svg({ children, ...props }: SvgProps) {
  return <svg {...sanitizeSvgProps(props)}>{children}</svg>;
}

export function Path(props: SVGProps<SVGPathElement>) {
  return <path {...sanitizeSvgProps(props)} />;
}

export function Circle(props: SVGProps<SVGCircleElement>) {
  return <circle {...sanitizeSvgProps(props)} />;
}

export function G(props: SVGProps<SVGGElement> & Pick<SvgProps, 'originX' | 'originY' | 'rotation'>) {
  return <g {...sanitizeSvgProps(props)} />;
}

export function Line(props: SVGProps<SVGLineElement>) {
  return <line {...sanitizeSvgProps(props)} />;
}

export function Rect(props: SVGProps<SVGRectElement>) {
  return <rect {...sanitizeSvgProps(props)} />;
}

export function Defs(props: SVGProps<SVGDefsElement>) {
  return <defs {...sanitizeSvgProps(props)} />;
}

export function LinearGradient(props: SVGProps<SVGLinearGradientElement>) {
  return <linearGradient {...sanitizeSvgProps(props)} />;
}

export function Stop(props: SVGProps<SVGStopElement>) {
  return <stop {...sanitizeSvgProps(props)} />;
}

function sanitizeSvgProps<T extends object>(props: T) {
  const {
    accessibilityLabel,
    accessibilityRole,
    animatedProps,
    originX,
    originY,
    rotation,
    transform,
    ...rest
  } = props as T &
    Pick<SvgProps, 'accessibilityLabel' | 'accessibilityRole' | 'animatedProps' | 'originX' | 'originY' | 'rotation' | 'transform'>;
  const role = accessibilityRole === 'image' ? 'img' : undefined;
  const rotate =
    typeof rotation === 'number'
      ? `rotate(${rotation}${typeof originX === 'number' && typeof originY === 'number' ? ` ${originX} ${originY}` : ''})`
      : undefined;

  return {
    ...rest,
    ...(role ? { role } : null),
    ...(accessibilityLabel ? { 'aria-label': accessibilityLabel } : null),
    ...(rotate || transform ? { transform: [transform, rotate].filter(Boolean).join(' ') } : null),
  };
}
