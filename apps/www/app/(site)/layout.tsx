import { TopNav } from "@/components/nav/TopNav";
import { Footer } from "@/components/nav/Footer";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <TopNav />
      {children}
      <Footer />
    </div>
  );
}
