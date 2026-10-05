"use client";

import { IntranetSidebar } from "@/components/layout/intranet-sidebar";
import { LayoutDashboard } from "lucide-react";

export function PortalSidebar() {
  return (
    <IntranetSidebar 
      activeItem="dashboard" 
      hideUser 
      navItems={[
        {
          id: "dashboard",
          label: "Dashboard",
          icon: LayoutDashboard,
          href: "/dashboard",
          group: "inicio"
        }
      ]}
    />
  );
}
