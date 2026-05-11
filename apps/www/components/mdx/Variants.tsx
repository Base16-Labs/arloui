import { cn } from "@/lib/cn";

type VariantsProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

export function Variants({ children, title, className }: VariantsProps) {
  return (
    <div className={cn("my-8 flex flex-col gap-4", className)}>
      {title && <h4 className="text-[14px] font-medium text-ink">{title}</h4>}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {children}
      </div>
    </div>
  );
}
