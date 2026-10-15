import { SiteHeaderHub } from "@/components/site-header-hub";

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <SiteHeaderHub showSidebarTrigger={false} />
      <main className="flex-1 w-full">{children}</main>
    </div>
  );
}
