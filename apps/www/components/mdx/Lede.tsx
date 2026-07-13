export function Lede({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-[18px] mb-6 max-w-[600px] text-[14px] leading-relaxed tracking-tight text-ink-2">
      {children}
    </p>
  );
}
