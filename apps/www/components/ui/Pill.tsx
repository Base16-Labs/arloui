import { cn } from "@/lib/cn";

type PillProps = {
  children: React.ReactNode;
  variant?: "default" | "dark";
  className?: string;
  onClick?: () => void;
  as?: "button" | "a" | "span";
  href?: string;
};

export function Pill({
  children,
  variant = "default",
  className,
  onClick,
  as = "span",
  href,
}: PillProps) {
  const classes = cn(
    "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12.5px]",
    variant === "dark"
      ? "border border-ink bg-ink text-canvas"
      : "border border-line-strong bg-canvas text-ink-2",
    className
  );

  if (as === "a" && href) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={classes}
      >
        {children}
      </a>
    );
  }

  if (as === "button" || onClick) {
    return (
      <button onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }

  return <span className={classes}>{children}</span>;
}
