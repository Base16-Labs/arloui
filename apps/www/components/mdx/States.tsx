import { cn } from "@/lib/cn";

type StatesProps = {
  children: React.ReactNode;
  className?: string;
};

export function States({ children, className }: StatesProps) {
  return (
    <div className={cn("my-8 flex flex-col gap-6", className)}>
      {children}
    </div>
  );
}
