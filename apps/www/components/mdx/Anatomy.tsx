import { cn } from "@/lib/cn";

type AnatomyProps = {
  children: React.ReactNode;
  caption?: string;
  className?: string;
};

export function Anatomy({ children, caption, className }: AnatomyProps) {
  return (
    <div className={cn("my-8", className)}>
      <div className="relative flex min-h-[200px] items-center justify-center rounded-2xl border border-line-weak bg-surface p-8 shadow-sm">
        {children}
      </div>
      {caption && (
        <p className="mt-3 text-center text-[13px] text-ink-3">{caption}</p>
      )}
    </div>
  );
}
