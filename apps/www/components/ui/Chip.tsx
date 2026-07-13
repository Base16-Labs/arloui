import { cn } from "@/lib/cn";

type ChipProps = {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
  className?: string;
};

export function Chip({ children, active, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-[5px] text-xs",
        active
          ? "border-ink bg-ink text-canvas"
          : "border-line-strong bg-canvas text-ink-2",
        className
      )}
    >
      {children}
    </button>
  );
}
