import { SidebarProvider } from "@/components/ui/sidebar";
import { IntranetSidebar } from "@/components/layout/intranet-sidebar";
import { GeoportalHeader } from "@/components/layout/geoportal-header";

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-background flex-col lg:flex-row">
        {/* Sidebar */}
        <IntranetSidebar activeItem="home" />

        {/* Contenido principal */}
        <div className="flex w-full flex-1 flex-col overflow-hidden">
          {/* Header */}
          <GeoportalHeader />
          
          {/* Main content wrapper */}
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto w-full max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
