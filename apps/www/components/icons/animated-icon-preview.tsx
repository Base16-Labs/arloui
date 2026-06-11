'use client';

import { useEffect, useRef, useState } from 'react';

export type AnimatedIconName =
  | 'menu-close'
  | 'plus-minus'
  | 'play-pause'
  | 'arrow-right-down'
  | 'chevron-right-down'
  | 'download-check';

type Stroke = readonly [number, number, number, number, number?];

type Definition = {
  labels: readonly [string, string];
  from: readonly [Stroke, Stroke, Stroke];
  to: readonly [Stroke, Stroke, Stroke];
  rotation?: readonly [number, number];
};

const point: Stroke = [12, 12, 12, 12, 0];

export const animatedIconDefinitions: Record<AnimatedIconName, Definition> = {
  'menu-close': {
    labels: ['Menu', 'Close'],
    from: [
      [5, 7, 19, 7],
      [5, 12, 19, 12],
      [5, 17, 19, 17],
    ],
    to: [[6.5, 6.5, 17.5, 17.5], point, [17.5, 6.5, 6.5, 17.5]],
  },
  'plus-minus': {
    labels: ['Plus', 'Minus'],
    from: [[5, 12, 19, 12], [12, 5, 12, 19], point],
    to: [[5, 12, 19, 12], point, point],
  },
  'play-pause': {
    labels: ['Play', 'Pause'],
    from: [
      [7, 5, 18, 12],
      [18, 12, 7, 19],
      [7, 19, 7, 5],
    ],
    to: [[9, 6, 9, 18], [15, 6, 15, 18], point],
  },
  'arrow-right-down': {
    labels: ['Arrow right', 'Arrow down'],
    from: [
      [4, 12, 19, 12],
      [14, 7, 19, 12],
      [19, 12, 14, 17],
    ],
    to: [
      [4, 12, 19, 12],
      [14, 7, 19, 12],
      [19, 12, 14, 17],
    ],
    rotation: [0, 90],
  },
  'chevron-right-down': {
    labels: ['Chevron right', 'Chevron down'],
    from: [[8, 6, 14, 12], [14, 12, 8, 18], point],
    to: [[8, 6, 14, 12], [14, 12, 8, 18], point],
    rotation: [0, 90],
  },
  'download-check': {
    labels: ['Download', 'Complete'],
    from: [
      [12, 4, 12, 16],
      [7, 11, 12, 16],
      [12, 16, 17, 11],
    ],
    to: [[5, 12, 10, 17], [10, 17, 19, 7], point],
  },
};

function mix(from: number, to: number, progress: number) {
  return from + (to - from) * progress;
}

function mixStroke(from: Stroke, to: Stroke, progress: number): Stroke {
  return [
    mix(from[0], to[0], progress),
    mix(from[1], to[1], progress),
    mix(from[2], to[2], progress),
    mix(from[3], to[3], progress),
    mix(from[4] ?? 1, to[4] ?? 1, progress),
  ];
}

function easeOut(progress: number) {
  return 1 - Math.pow(1 - progress, 4);
}

export function AnimatedIconPreview({
  name,
  active,
  size = 32,
}: {
  name: AnimatedIconName;
  active: boolean;
  size?: number;
}) {
  const definition = animatedIconDefinitions[name];
  const target = active ? 1 : 0;
  const currentRef = useRef(target);
  const [progress, setProgress] = useState(target);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      currentRef.current = target;
      setProgress(target);
      return;
    }

    const start = currentRef.current;
    const startedAt = performance.now();
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = Math.min((now - startedAt) / 200, 1);
      const next = mix(start, target, easeOut(elapsed));
      currentRef.current = next;
      setProgress(next);
      if (elapsed < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target]);

  const rotation = definition.rotation
    ? mix(definition.rotation[0], definition.rotation[1], progress)
    : 0;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g
        transform={`rotate(${rotation} 12 12)`}
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {definition.from.map((from, index) => {
          const line = mixStroke(from, definition.to[index], progress);
          return (
            <line
              key={index}
              x1={line[0]}
              y1={line[1]}
              x2={line[2]}
              y2={line[3]}
              opacity={line[4]}
            />
          );
        })}
      </g>
    </svg>
  );
}
