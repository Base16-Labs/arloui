import { cn } from "@/lib/cn";

type PhoneFrameProps = {
  children?: React.ReactNode;
  className?: string;
};

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "w-[240px] rounded-[36px] bg-preview-screen p-1.5",
        className
      )}
    >
      <div className="h-[480px] w-full overflow-hidden rounded-[30px] bg-surface">
        {children}
      </div>
    </div>
  );
}

export function PreviewCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex min-h-[480px] items-center justify-center rounded-2xl border border-line bg-surface-sunken p-7 dark:bg-surface-raised",
        className
      )}
    >
      {children}
    </div>
  );
}
