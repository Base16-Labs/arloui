import { cn } from "@/lib/cn";

type StatusTone =
  | "neutral"
  | "draft"
  | "progress"
  | "waiting"
  | "changes"
  | "approved"
  | "live"
  | "archived"
  | "danger";

type StatusIcon =
  | "spinner"
  | "pencil"
  | "progress"
  | "eye"
  | "flag"
  | "check"
  | "play"
  | "archive"
  | "warning";

type StatusBadgeProps = {
  children: React.ReactNode;
  tone?: StatusTone;
  icon?: StatusIcon;
  className?: string;
};

const toneClasses: Record<StatusTone, string> = {
  neutral:
    "bg-white text-[#18181B] shadow-[0_8px_18px_rgb(24_24_27/0.18)] dark:bg-[#27272a] dark:text-[#fafafa] dark:shadow-none",
  draft: "bg-[#ECECFF] text-[#23206A] dark:bg-indigo-500/15 dark:text-indigo-300",
  progress: "bg-[#CDF8FF] text-[#164E55] dark:bg-cyan-500/15 dark:text-cyan-300",
  waiting: "bg-[#F9E7FF] text-[#6E1977] dark:bg-fuchsia-500/15 dark:text-fuchsia-300",
  changes: "bg-[#FFF2D9] text-[#9A5B21] dark:bg-amber-500/15 dark:text-amber-300",
  approved: "bg-[#DDFBE8] text-[#166534] dark:bg-emerald-500/15 dark:text-emerald-300",
  live: "bg-[#50FA7B] text-[#155E2B] dark:bg-green-500/15 dark:text-green-300",
  archived: "bg-[#FFB399] text-[#7C3A18] dark:bg-orange-500/15 dark:text-orange-300",
  danger: "bg-[#FFE4E6] text-[#9F1D1D] dark:bg-rose-500/15 dark:text-rose-300",
};

const iconPaths: Record<StatusIcon, string> = {
  spinner:
    "M12 3a9 9 0 1 0 9 9 .75.75 0 0 0-1.5 0A7.5 7.5 0 1 1 12 4.5.75.75 0 0 0 12 3Z",
  pencil:
    "M18.54 4.46a1.5 1.5 0 0 0-2.12 0L5.25 15.63V18.75h3.12L19.54 7.58a1.5 1.5 0 0 0 0-2.12l-1-1ZM7.75 17.25h-1v-1l7.97-7.97 1 1-7.97 7.97Zm9.03-9.03-1-1 1.7-1.7 1 1-1.7 1.7Z",
  progress:
    "M20.25 12a8.25 8.25 0 1 1-8.25-8.25.75.75 0 0 1 0 1.5A6.75 6.75 0 1 0 18.75 12a.75.75 0 0 1 1.5 0Z",
  eye:
    "M12 5.25c6 0 9.42 5.84 9.56 6.09a.75.75 0 0 1 0 .74c-.14.25-3.56 6.09-9.56 6.09s-9.42-5.84-9.56-6.09a.75.75 0 0 1 0-.74C2.58 11.09 6 5.25 12 5.25Zm0 11.42c4.37 0 7.22-3.77 8.02-4.96-.8-1.19-3.65-4.96-8.02-4.96s-7.22 3.77-8.02 4.96c.8 1.19 3.65 4.96 8.02 4.96Zm0-7.92a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 1.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3Z",
  flag:
    "M5.25 21a.75.75 0 0 1-.75-.75V4.5a.75.75 0 0 1 .75-.75h6c.73 0 1.18.25 1.58.47.35.2.65.36 1.17.36h4.5a.75.75 0 0 1 .75.75v8.25a.75.75 0 0 1-.75.75H14c-.73 0-1.18-.25-1.58-.47-.35-.2-.65-.36-1.17-.36H6v6.75a.75.75 0 0 1-.75.75ZM6 12h5.25c.73 0 1.18.25 1.58.47.35.2.65.36 1.17.36h3.75V6.08H14c-.73 0-1.18-.25-1.58-.47-.35-.2-.65-.36-1.17-.36H6V12Z",
  check:
    "M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Zm4.28 7.78-5.25 5.25a.75.75 0 0 1-1.06 0l-2.25-2.25a.75.75 0 1 1 1.06-1.06l1.72 1.72 4.72-4.72a.75.75 0 1 1 1.06 1.06Z",
  play:
    "M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Zm3.43 10.38-5.25 3.38A.75.75 0 0 1 9 15.38V8.62a.75.75 0 0 1 1.18-.63l5.25 3.38a.75.75 0 0 1 0 1.26Z",
  archive:
    "M20.25 6.75h-16.5A.75.75 0 0 1 3 6V3.75A.75.75 0 0 1 3.75 3h16.5a.75.75 0 0 1 .75.75V6a.75.75 0 0 1-.75.75Zm-15.75-1.5h15V4.5h-15v.75ZM18.75 8.25v10.5A2.25 2.25 0 0 1 16.5 21h-9a2.25 2.25 0 0 1-2.25-2.25V8.25h1.5v10.5c0 .41.34.75.75.75h9c.41 0 .75-.34.75-.75V8.25h1.5ZM9.75 12.75h1.5V10.5a.75.75 0 0 1 1.5 0v2.25h1.5L12 15l-2.25-2.25Z",
  warning:
    "M12 2.25a9.75 9.75 0 1 0 0 19.5 9.75 9.75 0 0 0 0-19.5Zm-.75 5.25a.75.75 0 0 1 1.5 0v5.25a.75.75 0 0 1-1.5 0V7.5Zm.75 9.75a1.13 1.13 0 1 1 0-2.25 1.13 1.13 0 0 1 0 2.25Z",
};

export function StatusGlyph({ icon, className }: { icon: StatusIcon; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={cn("size-[18px] shrink-0", className)}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={iconPaths[icon]} />
    </svg>
  );
}

export function StatusBadge({ children, tone = "neutral", icon, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-8 items-center gap-2 rounded-md px-3 py-1.5 text-[13px] font-semibold leading-none",
        toneClasses[tone],
        className,
      )}
    >
      {icon ? <StatusGlyph icon={icon} /> : null}
      {children}
    </span>
  );
}

export type { StatusIcon, StatusTone };
