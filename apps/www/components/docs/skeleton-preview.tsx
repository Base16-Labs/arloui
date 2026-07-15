'use client';

import { useState } from 'react';
import { Chip } from '@/components/ui/Chip';
import { PhoneFrame, PreviewCard } from '@/components/ui/PhoneFrame';
import { cn } from '@/lib/cn';

type Pattern = 'feed' | 'article' | 'profile';
type Motion = 'shimmer' | 'pulse' | 'none';

export function SkeletonPhonePreview() {
  return (
    <PreviewCard className="mb-12">
      <PhoneFrame>
        <SkeletonScreen pattern="feed" motion="shimmer" />
      </PhoneFrame>
    </PreviewCard>
  );
}

export function SkeletonDocPlayground() {
  const [pattern, setPattern] = useState<Pattern>('feed');
  const [motion, setMotion] = useState<Motion>('shimmer');

  return (
    <section id="variants" className="border-t border-line py-9">
      <h2 className="text-[26px] font-semibold tracking-tight">Patterns &amp; motion</h2>
      <p className="mt-1.5 mb-6 text-[13px] text-ink-3">
        Compose simple bones to preserve the geometry of the content that will replace them.
      </p>

      <div className="grid gap-6 md:grid-cols-[1fr_minmax(280px,330px)] md:items-start">
        <div className="space-y-4">
          <ControlRow label="Pattern">
            {(['feed', 'article', 'profile'] as const).map((item) => (
              <Chip key={item} active={pattern === item} onClick={() => setPattern(item)}>
                {item}
              </Chip>
            ))}
          </ControlRow>
          <ControlRow label="Motion">
            {(['shimmer', 'pulse', 'none'] as const).map((item) => (
              <Chip key={item} active={motion === item} onClick={() => setMotion(item)}>
                {item}
              </Chip>
            ))}
          </ControlRow>
        </div>

        <div className="flex justify-center rounded-xl border border-line bg-canvas p-4 md:sticky md:top-3">
          <div className="h-[430px] w-full max-w-[300px] overflow-hidden rounded-[24px] border border-line-strong">
            <SkeletonScreen pattern={pattern} motion={motion} compact />
          </div>
        </div>
      </div>
    </section>
  );
}

function SkeletonScreen({
  pattern,
  motion,
  compact = false,
}: {
  pattern: Pattern;
  motion: Motion;
  compact?: boolean;
}) {
  return (
    <div className={cn('h-full bg-white p-4 dark:bg-[#101014]', compact && 'p-5')}>
      {pattern === 'feed' ? <Feed motion={motion} /> : null}
      {pattern === 'article' ? <Article motion={motion} /> : null}
      {pattern === 'profile' ? <Profile motion={motion} /> : null}
      <style>{`
        @keyframes arlo-skeleton-shimmer {
          from {
            transform: translateX(-120%);
          }
          to {
            transform: translateX(320%);
          }
        }
        @keyframes arlo-skeleton-pulse {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.48;
          }
        }
        .arlo-skeleton-shimmer {
          animation: arlo-skeleton-shimmer 1200ms linear infinite;
        }
        .arlo-skeleton-pulse {
          animation: arlo-skeleton-pulse 1200ms ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .arlo-skeleton-shimmer,
          .arlo-skeleton-pulse {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function Bone({ className, motion }: { className: string; motion: Motion }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'relative overflow-hidden bg-[#E5E7EB] dark:bg-[#273244]',
        motion === 'pulse' && 'arlo-skeleton-pulse',
        className,
      )}
    >
      {motion === 'shimmer' ? (
        <span className="arlo-skeleton-shimmer absolute inset-y-0 left-0 w-2/5 rounded-[inherit] bg-gradient-to-r from-transparent via-white/60 to-transparent dark:via-white/10" />
      ) : null}
    </div>
  );
}

function Feed({ motion }: { motion: Motion }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2.5">
        <Bone motion={motion} className="size-9 shrink-0 rounded-full" />
        <div className="w-full space-y-1.5">
          <Bone motion={motion} className="h-2.5 w-[46%] rounded-full" />
          <Bone motion={motion} className="h-2 w-[28%] rounded-full" />
        </div>
      </div>
      <Bone motion={motion} className="h-[205px] w-full rounded-2xl" />
      <div className="space-y-2">
        <Bone motion={motion} className="h-2.5 w-[88%] rounded-full" />
        <Bone motion={motion} className="h-2.5 w-[64%] rounded-full" />
      </div>
      <div className="flex gap-2">
        <Bone motion={motion} className="h-7 w-14 rounded-full" />
        <Bone motion={motion} className="h-7 w-14 rounded-full" />
      </div>
    </div>
  );
}

function Article({ motion }: { motion: Motion }) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Bone motion={motion} className="h-5 w-[92%] rounded-full" />
        <Bone motion={motion} className="h-5 w-[68%] rounded-full" />
      </div>
      <div className="flex items-center gap-2">
        <Bone motion={motion} className="size-8 rounded-full" />
        <Bone motion={motion} className="h-2.5 w-[32%] rounded-full" />
      </div>
      <Bone motion={motion} className="h-36 w-full rounded-2xl" />
      <div className="space-y-2">
        {['w-full', 'w-[96%]', 'w-[86%]', 'w-[92%]', 'w-[60%]'].map((width, index) => (
          <Bone
            key={`${width}-${index}`}
            motion={motion}
            className={cn('h-2.5 rounded-full', width)}
          />
        ))}
      </div>
    </div>
  );
}

function Profile({ motion }: { motion: Motion }) {
  return (
    <div className="flex flex-col items-center gap-3 pt-3">
      <Bone motion={motion} className="size-20 rounded-full" />
      <Bone motion={motion} className="h-4 w-28 rounded-full" />
      <Bone motion={motion} className="h-2.5 w-16 rounded-full" />
      <div className="my-2 flex w-full justify-around py-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex flex-col items-center gap-2">
            <Bone motion={motion} className="h-4 w-8 rounded-md" />
            <Bone motion={motion} className="h-2 w-12 rounded-full" />
          </div>
        ))}
      </div>
      <Bone motion={motion} className="h-10 w-full rounded-full" />
      <div className="w-full space-y-3 pt-2">
        {[0, 1, 2].map((item) => (
          <div key={item} className="flex items-center gap-3">
            <Bone motion={motion} className="size-9 rounded-full" />
            <div className="flex-1 space-y-1.5">
              <Bone motion={motion} className="h-2.5 w-[58%] rounded-full" />
              <Bone motion={motion} className="h-2 w-[34%] rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ControlRow({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[100px_1fr] sm:items-center">
      <span className="text-[11px] font-medium uppercase tracking-widest text-ink-3">{label}</span>
      <div className="flex flex-wrap gap-2">{children}</div>
    </div>
  );
}
