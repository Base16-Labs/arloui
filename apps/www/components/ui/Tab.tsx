import { cn } from "@/lib/cn";

type TabProps = {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
};

export function Tab({ active, children, onClick, className }: TabProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex h-8 items-center justify-center rounded-full px-3.5 text-[13px] font-medium transition-colors",
        active
          ? "bg-ink text-canvas"
          : "text-ink-2 hover:bg-surface hover:text-ink",
        className
      )}
    >
      {children}
    </button>
  );
}
