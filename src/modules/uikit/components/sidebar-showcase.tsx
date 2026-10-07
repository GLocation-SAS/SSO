"use client";


import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { getAssetPath } from "@/lib/assets";
import {
  Globe2,
  Home,
  FileText,
  Building2,
  FolderOpen,
  LogIn,
  Shield,
  BarChart3,
  Layers,
  Users,
  ChevronRight,
  ChevronDown,
  HelpCircle,
  LogOut,
  Sun,
  Moon,
  Settings,
  PanelLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { Switch } from "@/components/ui/switch";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ── Mini Sidebar Preview ────────────────────────────────────────────────────

interface NavItemDef {
  label: string;
  icon: React.ElementType;
  active?: boolean;
  children?: { label: string; icon: React.ElementType; active?: boolean }[];
}

const NAV_ITEMS: NavItemDef[] = [
  { label: "Inicio", icon: Home },
  {
    label: "Trámites", icon: FileText, active: true,
    children: [
      { label: "Concesiones Mineras", icon: Shield },
      { label: "Permisos Ambientales", icon: FileText, active: true },
      { label: "Consulta de Estado", icon: BarChart3 },
    ],
  },
  { label: "Instituciones", icon: Building2 },
  { label: "Geoportal", icon: Globe2 },
  {
    label: "Recursos", icon: FolderOpen,
    children: [
      { label: "Capas Geográficas", icon: Layers },
      { label: "Datos Abiertos", icon: BarChart3 },
      { label: "Directorio", icon: Users },
    ],
  },
  { label: "Acceso", icon: LogIn },
];

function SidebarNavItem({
  item,
  collapsed,
}: {
  item: NavItemDef;
  collapsed: boolean;
}) {
  const [open, setOpen] = useState(item.active ?? false);
  const Icon = item.icon;
  const hasChildren = !!item.children?.length;

  return (
    <li>
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              onClick={() => hasChildren && setOpen(!open)}
              className={cn(
                "w-full flex items-center transition-all duration-150 outline-none h-auto",
                collapsed ? "justify-center p-2 rounded-lg" : "gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-left",
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-foreground/70 hover:bg-muted/60 hover:text-foreground"
              )}
            >
              <div className="relative flex items-center justify-center">
                <Icon className="size-4 shrink-0" />
              </div>
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {hasChildren && (
                    <ChevronRight
                      className={cn(
                        "size-3.5 shrink-0 text-muted-foreground transition-transform duration-200",
                        open && "rotate-90"
                      )}
                    />
                  )}
                </>
              )}
            </Button>
          </TooltipTrigger>
          {collapsed && (
            <TooltipContent side="right" align="center" className="z-[100]">
              {item.label}
            </TooltipContent>
          )}
        </Tooltip>
      </TooltipProvider>

      {/* Sub-items */}
      {hasChildren && (open || collapsed) && (
        <ul
          className={cn(
            "mt-1 space-y-0.5",
            collapsed ? "flex flex-col items-center gap-1 w-full border-y border-border/50 py-1.5 my-1" : "ml-6 border-l border-border pl-3"
          )}
        >
          {item.children!.map((child) => {
            const ChildIcon = child.icon;
            return (
              <li key={child.label} className={collapsed ? "w-full flex justify-center" : "w-full"}>
                <TooltipProvider delayDuration={0}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        className={cn(
                          "flex items-center rounded-md transition-all duration-200 outline-none h-auto",
                          collapsed
                            ? "justify-center p-2 opacity-60 hover:opacity-100 hover:bg-muted/50" // Lower hierarchy, centered icon
                            : "w-full gap-2 px-2 py-1.5 text-xs font-medium text-left",
                          child.active && collapsed ? "bg-primary/10 text-primary opacity-100" : "",
                          child.active && !collapsed ? "text-primary bg-primary/8" : "",
                          !child.active && !collapsed ? "text-foreground/60 hover:text-foreground hover:bg-muted/50" : ""
                        )}
                      >
                        <ChildIcon className={cn("shrink-0", collapsed ? "size-4" : "size-3.5")} />
                        {!collapsed && <span className="truncate">{child.label}</span>}
                      </Button>
                    </TooltipTrigger>
                    {collapsed && (
                      <TooltipContent side="right" align="center" className="z-[100]">
                        {child.label}
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              </li>
            );
          })}
        </ul>
      )}
    </li>
  );
}

const defaultSidebarConfig = {
  showBranding: true,
  showUser: true,
  showThemeToggle: true,
};

function SidebarPreview({ collapsed, variant = "full", navItems = NAV_ITEMS, config = defaultSidebarConfig }: { collapsed: boolean, variant?: "full" | "navigation", navItems?: NavItemDef[], config?: typeof defaultSidebarConfig }) {
  const showNav = true;
  const showUser = variant === "full" && config.showUser;
  const showBranding = variant === "full" && config.showBranding;

  return (
    <div
      className={cn(
        "flex flex-col h-full bg-surface border-r border-border transition-all duration-300",
        collapsed ? "w-14" : "w-60"
      )}
    >
      {showBranding ? (
        <>
          {/* ── Institutional header ── */}
          <div className="bg-primary px-3 py-2 flex items-center justify-end shrink-0 min-h-[38px]">
            <Button variant="ghost" type="button" className="p-1 h-auto rounded-md text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground transition-colors shrink-0">
              <PanelLeft className="size-4" />
            </Button>
          </div>

          {/* ── Logo row ── */}
          <div className={cn("flex items-center gap-2.5 px-3 py-2.5 border-b border-border shrink-0", collapsed ? "justify-center" : "justify-start")}>
            {collapsed ? (
              <>
                <img
                  src={getAssetPath("/escudo-light.svg")}
                  alt="Símbolo Icon"
                  className="h-6 w-auto object-contain mx-auto dark:hidden"
                />
                <img
                  src={getAssetPath("/escudo-dark.svg")}
                  alt="Símbolo Icon"
                  className="h-6 w-auto object-contain mx-auto hidden dark:block"
                />
              </>
            ) : (
              <>
                <img
                  src={getAssetPath("/horizontal-light.svg")}
                  alt="Logo MINEDEC GEOportal"
                  className="h-7 w-auto object-contain dark:hidden"
                />
                <img
                  src={getAssetPath("/horizontal-dark.svg")}
                  alt="Logo MINEDEC GEOportal"
                  className="h-7 w-auto object-contain hidden dark:block"
                />
              </>
            )}
          </div>
        </>
      ) : (
        <div className={cn("flex items-center p-3 border-b border-border min-h-[48px] shrink-0", collapsed ? "justify-center" : "justify-between")}>
          {!collapsed && (
            <span className="text-body-sm font-bold text-sidebar-foreground ml-1">
              Menú de navegación
            </span>
          )}
          <TooltipProvider delayDuration={0}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" type="button" className="p-1.5 h-auto rounded-md hover:bg-muted text-muted-foreground transition-colors shrink-0">
                  <PanelLeft className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side={collapsed ? "right" : "bottom"} align="center" className="z-[100]">
                {collapsed ? "Expandir menú" : "Colapsar menú"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      )}

      {/* ── Nav ── */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {showNav && (
          <>
            {!collapsed && (
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground/50 px-2 mb-2">
                Inicio
              </p>
            )}
            <ul className="space-y-0.5">
              {navItems.map((item) => (
                <SidebarNavItem key={item.label} item={item} collapsed={collapsed} />
              ))}
            </ul>
          </>
        )}
      </nav>

      {/* ── Footer ── */}
      <div className="shrink-0 border-t border-border px-2 py-2 space-y-1">
        {/* Theme toggle */}
        {config.showThemeToggle && (
          collapsed ? (
            <div className="flex justify-center mb-2 w-full">
              <ThemeToggle />
            </div>
          ) : (
            <div className="px-3 py-2 mb-2">
              <Button
                type="button"
                variant="ghost"
                className={cn(
                  "relative flex w-full h-auto items-center p-1 rounded-full border border-sidebar-border/50",
                  "bg-sidebar-accent/50 hover:bg-sidebar-accent transition-colors duration-300"
                )}
                aria-label="Alternar tema"
              >
                <div
                  className={cn(
                    "absolute inset-y-1 left-1 w-[calc(50%-4px)] rounded-full shadow-sm transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                    "bg-sidebar translate-x-0 dark:translate-x-full"
                  )}
                />
                <div
                  className={cn(
                    "relative z-10 flex flex-1 items-center justify-center gap-2 py-1.5 text-xs font-bold transition-colors duration-300",
                    "text-sidebar-foreground dark:text-sidebar-foreground/50 dark:hover:text-sidebar-foreground/80"
                  )}
                >
                  <Sun className="size-4" />
                  Claro
                </div>
                <div
                  className={cn(
                    "relative z-10 flex flex-1 items-center justify-center gap-2 py-1.5 text-xs font-bold transition-colors duration-300",
                    "text-sidebar-foreground/50 hover:text-sidebar-foreground/80 dark:text-sidebar-foreground"
                  )}
                >
                  <Moon className="size-4" />
                  Oscuro
                </div>
              </Button>
            </div>
          )
        )}
        {/* User */}
        {showUser && (
          <div className={cn("flex items-center gap-2 px-2 py-2 mt-1 rounded-xl bg-muted/50",
            collapsed ? "justify-center mx-auto w-auto" : "w-full"
          )}>
            <div className="size-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-[10px] font-bold shrink-0">
              MA
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">María Arango</p>
                <p className="text-[10px] text-muted-foreground truncate">m.arango@minedec.gov</p>
              </div>
            )}
            {!collapsed && (
              <Button variant="ghost" type="button" className="p-1 h-auto rounded-md text-muted-foreground hover:text-danger transition-colors shrink-0">
                <LogOut className="size-3.5" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Showcase ────────────────────────────────────────────────────────────────

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Menu, Settings2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function SidebarShowcase() {
  const [collapsed, setCollapsed] = useState(false);
  const [variant, setVariant] = useState<"full" | "navigation">("full");
  const [navItemsState, setNavItemsState] = useState<NavItemDef[]>(NAV_ITEMS);
  const [hiddenItems, setHiddenItems] = useState<number[]>([]);
  const [activeSection, setActiveSection] = useState("foundations");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [draftSidebarConfig, setDraftSidebarConfig] = useState(defaultSidebarConfig);
  const [sidebarConfig, setSidebarConfig] = useState(defaultSidebarConfig);

  const handleSave = () => {
    setSidebarConfig(draftSidebarConfig);
    setIsModalOpen(false);
    toast.success("Configuración del sidebar guardada correctamente");
  };

  const handleOpen = () => {
    setDraftSidebarConfig(sidebarConfig);
    setIsModalOpen(true);
  };

  const currentNavItems = navItemsState.filter((_, i) => !hiddenItems.includes(i));

  return (
    <div className="space-y-8">
      {/* Selector de Variante */}
      <div className="flex items-center gap-4 bg-muted/20 p-4 rounded-xl border border-border overflow-x-auto">
        <div className="flex flex-col gap-1.5 text-left">
          <span className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">Variante Sidebar</span>
          <Tabs
            value={variant}
            onValueChange={(val) => setVariant(val as "full" | "navigation")}
            className="w-auto"
          >
            <TabsList className="flex items-center gap-1 p-1 rounded-xl bg-muted/40 border border-border h-auto">
              {[
                { value: "full", label: "Completo", icon: Layers },
                { value: "navigation", label: "Navegación", icon: Menu },
              ].map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className={cn(
                    "flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-caption font-semibold transition-all duration-200 border-0 shadow-none cursor-pointer text-muted-foreground hover:text-foreground hover:bg-transparent bg-transparent",
                    "after:hidden data-[state=active]:bg-surface data-[state=active]:text-foreground data-[state=active]:shadow-sm data-[state=active]:border-0 data-[state=active]:hover:bg-surface"
                  )}
                >
                  <item.icon className="size-4" />
                  {item.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>

      {/* ── Botón de Personalización ── */}
      {variant === "full" && (
        <div className="flex justify-end">
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleOpen} variant="outline" className="gap-2">
                <Settings2 className="size-4" />
                Editar Componente
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Editar Sidebar</DialogTitle>
                <DialogDescription>
                  Personaliza la apariencia del sidebar. Los cambios se aplicarán cuando guardes.
                </DialogDescription>
              </DialogHeader>
              <div className="py-4 space-y-4">
                <h3 className="text-body font-bold">Apariencia del Sidebar</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={draftSidebarConfig.showBranding}
                      onCheckedChange={(c) => setDraftSidebarConfig(prev => ({ ...prev, showBranding: c }))}
                    />
                    <span className="text-sm font-semibold">Mostrar Logo Institucional</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={draftSidebarConfig.showUser}
                      onCheckedChange={(c) => setDraftSidebarConfig(prev => ({ ...prev, showUser: c }))}
                    />
                    <span className="text-sm font-semibold">Mostrar Usuario</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={draftSidebarConfig.showThemeToggle}
                      onCheckedChange={(c) => setDraftSidebarConfig(prev => ({ ...prev, showThemeToggle: c }))}
                    />
                    <span className="text-sm font-semibold">Mostrar Tema (Oscuro/Claro)</span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={() => setIsConfirmOpen(true)}>Guardar cambios</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <ConfirmDialog
            open={isConfirmOpen}
            onOpenChange={setIsConfirmOpen}
            onConfirm={handleSave}
          />
        </div>
      )}



      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* ── Expanded ── */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Expandido
            </h3>
            <Button
              variant="ghost"
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-primary hover:underline font-medium p-0 h-auto"
            >
              {collapsed ? "Expandir" : "Colapsar"} →
            </Button>
          </div>
          <div className="border border-border rounded-xl overflow-hidden shadow-sm" style={{ height: 560 }}>
            <SidebarPreview collapsed={collapsed} variant={variant} navItems={currentNavItems} config={sidebarConfig} />
          </div>
        </div>

        {/* ── Collapsed ── */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Colapsado (solo iconos)
          </h3>
          <div className="border border-border rounded-xl overflow-hidden shadow-sm" style={{ height: 560 }}>
            <SidebarPreview collapsed={true} variant={variant} navItems={currentNavItems} config={sidebarConfig} />
          </div>
        </div>
      </div>
    </div>
  );
}
