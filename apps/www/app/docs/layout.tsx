import { TopNav } from '@/components/nav/TopNav';
import { Sidebar } from '@/components/nav/Sidebar';
import { BottomPill } from '@/components/nav/BottomPill';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="flex min-h-dvh">
        <Sidebar />
        <div className="flex flex-1">{children}</div>
      </div>
      <BottomPill />
    </>
  );
}
