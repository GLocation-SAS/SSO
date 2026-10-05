"use client";

import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import { 
  Bell, 
  Check, 
  GraduationCap, 
  MessageSquare, 
  Calendar, 
  Megaphone, 
  Heart, 
  ChevronRight,
  ChevronLeft,
  Settings
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const NOTIFICATIONS = [
  {
    id: 1,
    title: "Nuevo estudiante matriculado",
    desc: 'Mariana López se unió a "Product Design"',
    time: "hace 2 min",
    icon: GraduationCap,
    iconColor: "text-primary",
    iconBg: "bg-primary/10",
    unread: true,
  },
  {
    id: 2,
    title: "Nuevo comentario en tu post",
    desc: 'Andrés comentó en "Tips para mejores flujos de usuario"',
    time: "hace 15 min",
    icon: MessageSquare,
    iconColor: "text-success",
    iconBg: "bg-success/10",
    unread: true,
  },
  {
    id: 3,
    title: "Fecha límite cercana",
    desc: '"Diseño de Wireframes" vence en 2 días',
    time: "hace 1 h",
    icon: Calendar,
    iconColor: "text-warning",
    iconBg: "bg-warning/10",
    unread: false,
  },
  {
    id: 4,
    title: "Actualización de Mentorly",
    desc: "Hemos lanzado nuevas analíticas en tu panel",
    time: "hace 3 h",
    icon: Megaphone,
    iconColor: "text-info",
    iconBg: "bg-info/10",
    unread: false,
  },
  {
    id: 5,
    title: "Tu publicación recibió me gusta",
    desc: 'Tu post "Sistemas de diseño a escala" recibió 24 likes',
    time: "hace 5 h",
    icon: Heart,
    iconColor: "text-danger",
    iconBg: "bg-danger/10",
    unread: false,
  },
];

export function NotificationsMenu({ isEmpty = false }: { isEmpty?: boolean }) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const TriggerButton = (
    <Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground transition-all duration-200 hover:bg-transparent hover:border-transparent data-[state=open]:bg-transparent data-[state=open]:border-transparent hover:text-foreground">
      <Bell className="size-5" strokeWidth={1.75} />
      {!isEmpty && (
        <span className="absolute right-1 top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-danger px-1 text-[10px] font-bold leading-none text-danger-foreground ring-2 ring-background">
          3
        </span>
      )}
    </Button>
  );

  // ── Vista Móvil (Full Screen Sheet) ──
  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <div onClick={() => setOpen(true)}>{TriggerButton}</div>
        <SheetContent 
          side="bottom" 
          showCloseButton={false}
          className="h-[100dvh] w-full p-0 border-none bg-background flex flex-col focus-visible:outline-none focus:outline-none rounded-none"
        >
          <SheetTitle className="sr-only">Notificaciones</SheetTitle>
          
          {/* Header Móvil */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-border/40 shrink-0 mt-4">
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => setOpen(false)}
              className="-ml-2 rounded-full text-foreground hover:bg-surface-subtle transition-colors"
              aria-label="Volver"
            >
              <ChevronLeft className="size-6" strokeWidth={2} />
            </Button>
            <h3 className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">Notificaciones</h3>
            <Button 
              variant="ghost"
              size="icon"
              className="-mr-2 rounded-full text-foreground hover:bg-surface-subtle transition-colors"
              aria-label="Ajustes de notificaciones"
            >
              <Settings className="size-5" strokeWidth={2} />
            </Button>
          </div>

          {/* Lista de Notificaciones */}
          <div className="flex-1 overflow-y-auto">
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center py-20 px-6 text-center h-full">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-surface-subtle mb-6 text-muted-foreground">
                  <Bell className="size-10" strokeWidth={1.5} />
                </div>
                <p className="text-h3 font-bold text-foreground mb-2">No tienes notificaciones</p>
                <p className="text-body text-muted-foreground">Cuando tengas nuevas notificaciones aparecerán aquí.</p>
              </div>
            ) : (
              <div className="flex flex-col py-2">
                {NOTIFICATIONS.map((notif) => (
                  <button 
                    key={notif.id}
                    onClick={() => setOpen(false)}
                    className="group relative flex w-full cursor-pointer items-start gap-4 px-5 py-4 outline-none transition-colors active:bg-surface-subtle"
                  >
                    <div className={cn("flex size-12 flex-shrink-0 items-center justify-center rounded-full", notif.iconBg, notif.iconColor)}>
                      <notif.icon className="size-6" strokeWidth={2} />
                    </div>
                    <div className="flex flex-1 flex-col gap-1 items-start text-left">
                      <p className="text-body-sm font-bold text-foreground">{notif.title}</p>
                      <p className="text-body-sm text-muted-foreground line-clamp-2 pr-4">{notif.desc}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <span className="text-caption font-medium text-muted-foreground">{notif.time}</span>
                      {notif.unread && (
                        <span className="size-2 rounded-full bg-primary mt-1" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Footer Móvil */}
          {!isEmpty && (
            <div className="shrink-0 p-4 pb-8 border-t border-border/40">
              <Button 
                variant="ghost"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-6 text-body-sm font-bold text-primary transition-colors hover:bg-primary-400/10"
              >
                Ver todas las notificaciones
                <ChevronRight className="size-4" strokeWidth={2.5} />
              </Button>
            </div>
          )}
        </SheetContent>
      </Sheet>
    );
  }

  // ── Vista Desktop (DropdownMenu) ──
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        {TriggerButton}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        side="bottom"
        align="end" 
        sideOffset={12}
        className={cn(
          "w-[380px] rounded-[24px] border border-border bg-surface shadow-md overflow-hidden flex flex-col",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-[0.98] data-[state=open]:zoom-in-[0.98]",
          "data-[state=closed]:slide-out-to-top-1.5 data-[state=open]:slide-in-from-top-1.5",
          "duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]"
        )}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border/40">
          <h3 className="text-[10px] font-heading font-bold uppercase tracking-widest text-muted-foreground">Notificaciones</h3>
          {!isEmpty && (
            <Button variant="ghost" className="text-xs font-semibold text-primary hover:text-primary-600 hover:underline p-0 h-auto bg-transparent hover:bg-transparent">
              Marcar todo como leído
            </Button>
          )}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto max-h-[400px]">
          {isEmpty ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-surface-subtle mb-4 text-muted-foreground">
                <Bell className="size-8" strokeWidth={1.5} />
              </div>
              <p className="text-sm font-bold text-foreground mb-1">No tienes notificaciones</p>
              <p className="text-xs text-muted-foreground">Cuando tengas nuevas notificaciones aparecerán aquí.</p>
            </div>
          ) : (
            <div className="flex flex-col py-2">
              {NOTIFICATIONS.map((notif) => (
                <DropdownMenuPrimitive.Item 
                  key={notif.id}
                  className="group relative flex cursor-pointer items-start gap-4 px-5 py-3 outline-none transition-colors hover:bg-surface-subtle"
                  onClick={() => setOpen(false)}
                >
                  <div className={cn("flex size-10 flex-shrink-0 items-center justify-center rounded-full", notif.iconBg, notif.iconColor)}>
                    <notif.icon className="size-5" strokeWidth={2} />
                  </div>
                  <div className="flex flex-1 flex-col gap-0.5">
                    <p className="text-sm font-bold text-foreground">{notif.title}</p>
                    <p className="text-xs text-muted-foreground line-clamp-2">{notif.desc}</p>
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0 ml-2">
                    <span className="text-[11px] font-medium text-muted-foreground">{notif.time}</span>
                    {notif.unread && (
                      <span className="size-2 rounded-full bg-primary" />
                    )}
                  </div>
                </DropdownMenuPrimitive.Item>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="border-t border-border/40 p-2">
            <Button 
              variant="ghost"
              onClick={() => setOpen(false)}
              className="flex w-full items-center justify-center gap-1 rounded-xl text-xs font-semibold text-primary transition-colors hover:bg-primary-400/5 hover:text-primary-400"
            >
              Ver todas las notificaciones
              <ChevronRight className="size-3.5" strokeWidth={2.5} />
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
