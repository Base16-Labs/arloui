'use client';

import { useEffect, useRef, useState } from 'react';

type LineAnimatedIconName =
  | 'menu-close'
  | 'plus-minus'
  | 'play-pause'
  | 'arrow-right-down'
  | 'chevron-right-down'
  | 'download-check'
  | 'eye-open-closed'
  | 'lock-unlock'
  | 'volume-mute'
  | 'mic-mute'
  | 'sun-moon'
  | 'grid-list'
  | 'sort-ascending-descending'
  | 'expand-collapse'
  | 'search-close'
  | 'send-loading'
  | 'copy-check'
  | 'upload-check'
  | 'envelope-open';

type SpecialAnimatedIconName =
  | 'heart-fill'
  | 'star-fill'
  | 'bookmark-fill'
  | 'bell-fill'
  | 'thumb-up-fill'
  | 'pin-fill'
  | 'spinner-check'
  | 'spinner-x'
  | 'circle-progress-check'
  | 'refresh-sync'
  | 'bell-shake'
  | 'dot-pulse';

export type AnimatedIconName = LineAnimatedIconName | SpecialAnimatedIconName;

type Stroke = readonly [number, number, number, number, number?];

type Definition = {
  labels: readonly [string, string];
  from: readonly Stroke[];
  to: readonly Stroke[];
  rotation?: readonly [number, number];
};

const point: Stroke = [12, 12, 12, 12, 0];

const lineDefinitions: Record<LineAnimatedIconName, Definition> = {
  'menu-close': {
    labels: ['Menu', 'Close'],
    from: [
      [4, 6, 20, 6],
      [4, 12, 20, 12],
      [4, 18, 20, 18],
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
      [4, 12, 20, 12],
      [14, 6, 20, 12],
      [20, 12, 14, 18],
    ],
    to: [
      [4, 12, 20, 12],
      [14, 6, 20, 12],
      [20, 12, 14, 18],
    ],
    rotation: [0, 90],
  },
  'chevron-right-down': {
    labels: ['Chevron right', 'Chevron down'],
    from: [[9, 5, 16, 12], [16, 12, 9, 19], point],
    to: [[9, 5, 16, 12], [16, 12, 9, 19], point],
    rotation: [0, 90],
  },
  'download-check': {
    labels: ['Download', 'Complete'],
    from: [
      [12, 3, 12, 15],
      [7, 10, 12, 15],
      [12, 15, 17, 10],
      [5, 19, 19, 19],
    ],
    to: [[5, 12, 10, 17], [10, 17, 19, 7], point, point],
  },
  'eye-open-closed': {
    labels: ['Eye open', 'Eye closed'],
    from: [[3, 12, 7, 8], [7, 8, 12, 6.5], [12, 6.5, 17, 8], [17, 8, 21, 12], [10, 12, 14, 12]],
    to: [[3.5, 10, 8, 13.5], [8, 13.5, 12, 14.5], [12, 14.5, 16, 13.5], [16, 13.5, 20.5, 10], [4, 4, 20, 20]],
  },
  'lock-unlock': {
    labels: ['Locked', 'Unlocked'],
    from: [[5, 10, 19, 10], [5, 10, 5, 20], [19, 10, 19, 20], [5, 20, 19, 20], [8, 10, 8, 7], [8, 7, 10, 4.5], [10, 4.5, 14, 4.5], [14, 4.5, 16, 7], [16, 7, 16, 10]],
    to: [[5, 10, 19, 10], [5, 10, 5, 20], [19, 10, 19, 20], [5, 20, 19, 20], [8, 10, 8, 7], [8, 7, 10, 4.5], [10, 4.5, 14, 4.5], [14, 4.5, 17, 7], [17, 7, 20, 6]],
  },
  'volume-mute': {
    labels: ['Volume on', 'Muted'],
    from: [[3, 9, 7, 9], [7, 9, 13, 5], [13, 5, 13, 19], [13, 19, 7, 15], [7, 15, 3, 15], [16, 8.5, 19.5, 12], [19.5, 12, 16, 15.5]],
    to: [[3, 9, 7, 9], [7, 9, 13, 5], [13, 5, 13, 19], [13, 19, 7, 15], [7, 15, 3, 15], [16, 8, 21, 16], [21, 8, 16, 16]],
  },
  'mic-mute': {
    labels: ['Microphone on', 'Microphone muted'],
    from: [[9, 5, 9, 12], [9, 5, 12, 3.5], [12, 3.5, 15, 5], [15, 5, 15, 12], [6, 11, 6, 13], [6, 13, 9, 16], [9, 16, 15, 16], [15, 16, 18, 13], [18, 13, 18, 11], [12, 16, 12, 21], [8, 21, 16, 21]],
    to: [[9, 5, 9, 12], [9, 5, 12, 3.5], [12, 3.5, 15, 5], [15, 5, 15, 12], [6, 11, 6, 13], [6, 13, 9, 16], [9, 16, 15, 16], [15, 16, 18, 13], [5, 5, 19, 19], [12, 16, 12, 21], [8, 21, 16, 21]],
  },
  'sun-moon': {
    labels: ['Light mode', 'Dark mode'],
    from: [[12, 5, 12, 2.5], [12, 21.5, 12, 19], [5, 12, 2.5, 12], [21.5, 12, 19, 12], [7.25, 7.25, 5.5, 5.5], [18.5, 18.5, 16.75, 16.75], [16.75, 7.25, 18.5, 5.5], [5.5, 18.5, 7.25, 16.75], [8, 12, 16, 12]],
    to: [[9, 4, 9, 4, 0], [9, 20, 9, 20, 0], [4, 12, 4, 12, 0], [20, 12, 20, 12, 0], [6, 6, 6, 6, 0], [18, 18, 18, 18, 0], [18, 6, 18, 6, 0], [6, 18, 6, 18, 0], [7, 5, 18, 18]],
    rotation: [0, 18],
  },
  'grid-list': {
    labels: ['Grid', 'List'],
    from: [[5, 5, 9, 5], [15, 5, 19, 5], [5, 12, 9, 12], [15, 12, 19, 12], [5, 19, 9, 19], [15, 19, 19, 19]],
    to: [[5, 6, 19, 6], point, [5, 12, 19, 12], point, [5, 18, 19, 18], point],
  },
  'sort-ascending-descending': {
    labels: ['Sort ascending', 'Sort descending'],
    from: [[5, 7, 10, 7], [5, 12, 14, 12], [5, 17, 19, 17]],
    to: [[5, 7, 19, 7], [5, 12, 14, 12], [5, 17, 10, 17]],
  },
  'expand-collapse': {
    labels: ['Expand', 'Collapse'],
    from: [[4, 9, 4, 4], [4, 4, 9, 4], [15, 4, 20, 4], [20, 4, 20, 9], [20, 15, 20, 20], [20, 20, 15, 20], [9, 20, 4, 20], [4, 20, 4, 15]],
    to: [[5, 10, 10, 10], [10, 10, 10, 5], [14, 5, 14, 10], [14, 10, 19, 10], [19, 14, 14, 14], [14, 14, 14, 19], [10, 19, 10, 14], [10, 14, 5, 14]],
  },
  'search-close': {
    labels: ['Search', 'Close'],
    from: [[4.5, 10.5, 7.5, 6.5], [7.5, 6.5, 12.5, 5.5], [12.5, 5.5, 16.5, 8.5], [16.5, 8.5, 15.5, 13.5], [15.5, 13.5, 11.5, 16.5], [11.5, 16.5, 6.5, 15.5], [15.5, 15.5, 20, 20]],
    to: [[6, 6, 18, 18], point, point, [18, 6, 6, 18], point, point, point],
  },
  'send-loading': {
    labels: ['Send', 'Loading'],
    from: [[3.5, 5, 21, 12], [21, 12, 3.5, 19], [3.5, 19, 8.5, 12], [8.5, 12, 3.5, 5]],
    to: [[12, 4, 18, 7], [18, 7, 20, 12], [20, 12, 17, 17], [17, 17, 12, 20]],
    rotation: [0, 180],
  },
  'copy-check': {
    labels: ['Copy', 'Copied'],
    from: [[8, 8, 18, 8], [18, 8, 18, 18], [18, 18, 8, 18], [8, 18, 8, 8], [5, 15, 5, 5], [5, 5, 15, 5], [15, 5, 15, 8]],
    to: [[5, 12, 10, 17], [10, 17, 19, 7], point, point, point, point, point],
  },
  'upload-check': {
    labels: ['Upload', 'Complete'],
    from: [[12, 21, 12, 8], [7, 13, 12, 8], [12, 8, 17, 13], [5, 21, 19, 21]],
    to: [[5, 12, 10, 17], [10, 17, 19, 7], point, point],
  },
  'envelope-open': {
    labels: ['Sealed mail', 'Open mail'],
    from: [[3.5, 7, 12, 13.5], [12, 13.5, 20.5, 7], [3.5, 7, 20.5, 7], [3.5, 7, 3.5, 18], [3.5, 18, 20.5, 18], [20.5, 18, 20.5, 7]],
    to: [[3.5, 12, 12, 5], [12, 5, 20.5, 12], [3.5, 12, 12, 17.5], [3.5, 12, 3.5, 19], [3.5, 19, 20.5, 19], [20.5, 19, 20.5, 12]],
  },
};

const specialLabels: Record<SpecialAnimatedIconName, readonly [string, string]> = {
  'heart-fill': ['Heart outline', 'Heart filled'],
  'star-fill': ['Star outline', 'Star filled'],
  'bookmark-fill': ['Bookmark outline', 'Bookmark filled'],
  'bell-fill': ['Bell outline', 'Bell filled'],
  'thumb-up-fill': ['Thumb up outline', 'Thumb up filled'],
  'pin-fill': ['Pin outline', 'Pin filled'],
  'spinner-check': ['Loading', 'Success'],
  'spinner-x': ['Loading', 'Error'],
  'circle-progress-check': ['In progress', 'Complete'],
  'refresh-sync': ['Refresh', 'Syncing'],
  'bell-shake': ['Notification', 'New notification'],
  'dot-pulse': ['Unread', 'Unread alert'],
};

export const animatedIconDefinitions: Record<AnimatedIconName, { labels: readonly [string, string] }> = {
  ...lineDefinitions,
  ...Object.fromEntries(
    Object.entries(specialLabels).map(([name, labels]) => [name, { labels }]),
  ) as Record<SpecialAnimatedIconName, { labels: readonly [string, string] }>,
};

function isSpecialName(name: AnimatedIconName): name is SpecialAnimatedIconName {
  return name in specialLabels;
}

function SpecialGlyph({
  name,
  active,
  progress,
}: {
  name: SpecialAnimatedIconName;
  active: boolean;
  progress: number;
}) {
  const common = {
    stroke: 'currentColor',
    strokeWidth: 1.5,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  switch (name) {
    case 'heart-fill':
      return <path d="M12 20.5s-8-4.7-8-11A4.5 4.5 0 0 1 12 6a4.5 4.5 0 0 1 8 3.5c0 6.3-8 11-8 11Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'star-fill':
      return <path d="m12 3.5 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3.5Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'bookmark-fill':
      return <path d="M6.5 4.5a1 1 0 0 1 1-1h9a1 1 0 0 1 1 1v16L12 17l-5.5 3.5v-16Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'bell-fill':
    case 'bell-shake':
      return (
        <>
          <path d="M6 10a6 6 0 0 1 12 0c0 6 2.5 7 2.5 7h-17S6 16 6 10Z" fill={active && name === 'bell-fill' ? 'currentColor' : 'none'} {...common} />
          <path d="M10 20a2.2 2.2 0 0 0 4 0" fill="none" {...common} />
        </>
      );
    case 'thumb-up-fill':
      return <path d="M7.5 10.5v9.5H4a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1h3.5Zm0 0 4.5-7a2 2 0 0 1 2 2v4h5a2 2 0 0 1 1.9 2.5l-1.5 5.8A3 3 0 0 1 16.5 20h-9v-9.5Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'pin-fill':
      return <path d="M12 21s7-6.2 7-12A7 7 0 1 0 5 9c0 5.8 7 12 7 12Z" fill={active ? 'currentColor' : 'none'} {...common} />;
    case 'spinner-check':
    case 'spinner-x':
    case 'circle-progress-check':
      return active ? (
        <>
          <circle cx="12" cy="12" r="9" fill="none" {...common} />
          {name === 'spinner-x' ? (
            <><line x1="8" y1="8" x2="16" y2="16" {...common} /><line x1="16" y1="8" x2="8" y2="16" {...common} /></>
          ) : (
            <path d="m7.5 12.5 3 3 6.5-7" fill="none" {...common} />
          )}
        </>
      ) : (
        <circle
          cx="12"
          cy="12"
          r="9"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 9}`}
          strokeDashoffset={(1 - progress) * 2 * Math.PI * 9}
          transform="rotate(-90 12 12)"
          {...common}
        />
      );
    case 'refresh-sync':
      return (
        <>
          <path d="M20 7v5h-5M4 17v-5h5" fill="none" {...common} />
          <path d="M6.2 8.7A7 7 0 0 1 18.8 7M17.8 15.3A7 7 0 0 1 5.2 17" fill="none" {...common} />
        </>
      );
    case 'dot-pulse':
      return <circle cx="12" cy="12" r={active ? 6 : 4} fill="currentColor" />;
  }
}

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
  const definition = isSpecialName(name) ? null : lineDefinitions[name];
  const target = active ? 1 : 0;
  const currentRef = useRef(target);
  const [progress, setProgress] = useState(target);
  const [motion, setMotion] = useState(0);
  const [resolved, setResolved] = useState(active);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      currentRef.current = target;
      setProgress(target);
      setMotion(0);
      setResolved(active);
      return;
    }

    const start = currentRef.current;
    const startedAt = performance.now();
    let frame = 0;
    const staged = name === 'spinner-check' || name === 'spinner-x' || name === 'circle-progress-check';
    if (!active) setResolved(false);
    else if (staged) setResolved(false);
    else setResolved(true);

    const tick = (now: number) => {
      const runtime = now - startedAt;
      const transitionDuration = name === 'circle-progress-check' && active ? 650 : 200;
      const elapsed = Math.min(runtime / transitionDuration, 1);
      const next = mix(start, target, easeOut(elapsed));
      currentRef.current = next;
      setProgress(next);

      if ((name === 'spinner-check' || name === 'spinner-x') && !active) {
        setMotion((runtime % 760) / 760);
      } else if (name === 'refresh-sync' && active) {
        setMotion((runtime % 700) / 700);
      } else if (name === 'send-loading' && active) {
        setMotion((runtime % 760) / 760);
      } else if (name === 'bell-shake' && active) {
        setMotion(Math.min(runtime / 400, 1));
      } else if (name === 'dot-pulse' && active) {
        setMotion(Math.min(runtime / 960, 1));
      } else if (name.endsWith('-fill') && active) {
        setMotion(Math.min(runtime / 320, 1));
      } else {
        setMotion(0);
      }

      if (staged && active && runtime >= (name === 'circle-progress-check' ? 650 : 220)) {
        setResolved(true);
      }

      const loops =
        ((name === 'spinner-check' || name === 'spinner-x') && !active) ||
        (name === 'refresh-sync' && active) ||
        (name === 'send-loading' && active);
      const oneShotDuration =
        name === 'bell-shake' ? 400 :
        name === 'dot-pulse' ? 960 :
        name.endsWith('-fill') ? 320 :
        staged && active ? (name === 'circle-progress-check' ? 650 : 220) : 0;
      if (loops || elapsed < 1 || runtime < oneShotDuration) {
        frame = requestAnimationFrame(tick);
      }
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, name, target]);

  const rotation = definition?.rotation
    ? mix(definition.rotation[0], definition.rotation[1], progress)
    : 0;

  if (isSpecialName(name)) {
    const isFill = name.endsWith('-fill');
    const specialRotation =
      name === 'refresh-sync' || ((name === 'spinner-check' || name === 'spinner-x') && !active)
        ? motion * 360
        : name === 'bell-shake'
          ? Math.sin(motion * Math.PI * 5) * (1 - motion) * 12
          : name === 'bell-fill'
            ? Math.sin(motion * Math.PI * 4) * (1 - motion) * 8
          : 0;
    const pulseWave = name === 'dot-pulse'
      ? Math.sin(Math.min(motion * 2, 2) * Math.PI) ** 2
      : 0;
    const fillWave = isFill
      ? motion < 0.44
        ? mix(0, 1, motion / 0.44)
        : mix(1, 0, (motion - 0.44) / 0.56)
      : 0;
    const scale =
      name === 'dot-pulse'
        ? 1 + pulseWave * 0.4
        : isFill
          ? 1 + fillWave * 0.2
          : 1;
    const translateY =
      name === 'thumb-up-fill' ? -2 * fillWave :
      name === 'pin-fill' ? 2 * fillWave : 0;

    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        style={{
          transform: `translateY(${translateY}px) rotate(${specialRotation}deg) scale(${scale})`,
          transformOrigin: 'center',
          opacity: name === 'dot-pulse' ? 1 - pulseWave * 0.4 : 1,
          color: name === 'spinner-x' && active ? '#DC2626' : undefined,
          transition: name === 'spinner-x' ? 'color 220ms ease-out' : undefined,
        }}
      >
        <SpecialGlyph name={name} active={resolved} progress={progress} />
      </svg>
    );
  }

  const lineDefinition = definition as Definition;

  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <g
        transform={`rotate(${rotation + (name === 'send-loading' && active ? motion * 360 : 0)} 12 12)`}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {lineDefinition.from.map((from, index) => {
          const line = mixStroke(from, lineDefinition.to[index], progress);
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
