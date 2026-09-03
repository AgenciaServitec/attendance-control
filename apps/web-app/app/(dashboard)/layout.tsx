import {AppSidebar} from "@/components/app-sidebar"
import {SidebarInset, SidebarProvider} from "@/components/ui/sidebar"
import {TooltipProvider} from "@/components/ui/tooltip";
import {SiteHeader} from "@/components/side-header";

export default function DashboardLayout({
                                            children,
                                        }: {
    children: React.ReactNode
}) {
    return (
        <TooltipProvider>
            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "calc(var(--spacing) * 72)",
                        "--header-height": "calc(var(--spacing) * 12)",
                    } as React.CSSProperties
                }
            >
                <AppSidebar variant="inset" />
                <SidebarInset>
                    <SiteHeader />
                    <div className="p-4 md:p-6">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>
    )
}