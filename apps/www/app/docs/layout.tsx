import { TopNav } from '@/components/nav/TopNav';
import { Sidebar } from '@/components/nav/Sidebar';
import { BottomPill } from '@/components/nav/BottomPill';

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopNav />
      <div className="flex min-h-[calc(100dvh-68px)] w-full">
        <Sidebar />
        <div className="grid min-w-0 flex-1 grid-cols-1 justify-items-center min-[1280px]:grid-cols-[minmax(0,1fr)_auto] min-[1280px]:justify-items-stretch [&>main]:w-full [&>main]:justify-self-center">
          {children}
        </div>
      </div>
      <BottomPill />
    </>
  );
}
