import { cn } from "@/lib/cn";
import { Icon } from "@/components/ui/Icon";

type PhoneFrameProps = {
  children?: React.ReactNode;
  className?: string;
};

export function PhoneFrame({ children, className }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        "w-[240px] rounded-[36px] bg-[#1a1a17] p-1.5",
        className
      )}
    >
      <div className="h-[480px] w-full overflow-hidden rounded-[30px] bg-[#faf8f1]">
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
        "relative flex min-h-[480px] items-center justify-center rounded-2xl border border-line bg-[#f8f6ef] p-7 dark:bg-surface-raised",
        className
      )}
    >
      <div className="absolute top-4 right-4 flex gap-1.5">
        <span className="flex items-center gap-1.5 rounded-full border border-line bg-canvas px-3 py-1.5 text-xs text-ink-2">
          ▦ Preview
        </span>
        <button className="flex h-8 w-8 items-center justify-center rounded-md border border-line bg-canvas text-ink-2">
          <Icon name="qr-code" size={14} />
        </button>
      </div>
      {children}
    </div>
  );
}
