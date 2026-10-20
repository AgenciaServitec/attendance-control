import { HubSidebar } from "@/components/hub-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteHeaderHub } from "@/components/site-header-hub";

export default function HubLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 68)",
            "--header-height": "calc(var(--spacing) * 14)",
          } as React.CSSProperties
        }
      >
        <HubSidebar variant="inset" />
        <SidebarInset className="bg-background">
          <SiteHeaderHub showSidebarTrigger={true} />
          <main className="p-4 md:p-6 w-full flex-1 overflow-x-hidden">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
