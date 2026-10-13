"use client";

import React from "react";
import {
  Building2,
  Key,
  Smartphone,
  CheckCircle2,
  Clock,
  Layers,
  ExternalLink,
  ShieldCheck,
  Lock,
  IdCard,
  Calendar,
  LayoutDashboard,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { useAuth } from "@/hooks/useAuth";
import { MIS_APLICACIONES_USUARIO } from "@/modules/mis-aplicaciones/data/mis-aplicaciones-data";
import { Link } from "@/routing";

export function MiPerfilView() {
  const { user } = useAuth();

  return (
    <div className="flex flex-col gap-4 w-full h-full pb-6">
      <div className="flex flex-col gap-6 w-full h-full">
        {/* Contenedor Principal con Bordes y Padding idéntico a /mi-dashboard y /aplicaciones */}
        <div className="border border-border rounded-xl bg-surface p-6 shadow-sm flex flex-col gap-6 w-full">
          {/* ── 1. Cabecera Institucional ── */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl md:text-3xl font-heading font-bold text-primary">
                Mi perfil
              </h1>
              <p className="text-sm md:text-base text-muted-foreground max-w-2xl">
                Ficha del funcionario institucional, credenciales de seguridad y trazabilidad de sedes y roles asignados en Conecta MINEDUC.
              </p>
            </div>
            <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0 justify-start sm:justify-end">
              <Button asChild variant="outline" size="sm" className="text-xs h-9">
                <Link href="/mi-dashboard">
                  <LayoutDashboard className="size-3.5 mr-1.5" />
                  Dashboard
                </Link>
              </Button>
              <Button asChild variant="primary" size="sm" className="text-xs h-9">
                <Link href="/mis-aplicaciones">
                  <Layers className="size-3.5 mr-1.5" />
                  Mis aplicaciones
                </Link>
              </Button>
            </div>
          </div>

          {/* ── 2. Grid Principal Equilibrado (12 Columnas, Sin Scroll Excesivo) ── */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full items-start">
            {/* ── COLUMNA IZQUIERDA (5 cols en lg / 4 cols en xl): Ficha e Identidad ── */}
            <div className="lg:col-span-5 xl:col-span-4 flex flex-col gap-5 w-full">
              {/* Card Identidad del Funcionario */}
              <Card className="rounded-xl border-border bg-card shadow-xs overflow-hidden">
                <CardHeader className="p-5 pb-4 bg-muted/20 border-b border-border/60">
                  <div className="flex items-center gap-3.5">
                    <div className="size-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-xl shrink-0 shadow-xs">
                      PR
                    </div>
                    <div className="flex flex-col min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-heading font-bold text-base text-foreground truncate">
                          {user?.displayName || "Paula Rozo"}
                        </span>
                        <Badge appearance="soft" tone="success" className="text-[10px] px-1.5 py-0">
                          Activo
                        </Badge>
                      </div>
                      <span className="text-xs text-muted-foreground truncate font-mono">
                        {user?.email || "prueba2@gmail.com"}
                      </span>
                      <span className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {user?.cargo || "Docente / Funcionario Institucional"}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-3 text-xs">
                  <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <IdCard className="size-3.5 text-muted-foreground/70" />
                      Cédula:
                    </span>
                    <span className="font-mono font-semibold text-foreground">1715896324</span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Building2 className="size-3.5 text-primary" />
                      Sede principal:
                    </span>
                    <span className="font-semibold text-foreground truncate max-w-[170px]" title={user?.sede || "Coordinación Zonal 9"}>
                      {user?.sede || "Coordinación Zonal 9"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1.5 border-b border-border/50">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5 text-secondary-600 dark:text-secondary-300" />
                      Tipo de cuenta:
                    </span>
                    <Badge appearance="outline" tone="primary" className="text-[10px]">
                      Estándar
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-1.5">
                    <span className="text-muted-foreground flex items-center gap-1.5">
                      <Calendar className="size-3.5 text-muted-foreground/70" />
                      Registro activo:
                    </span>
                    <span className="font-semibold text-foreground">Desde 2024</span>
                  </div>
                </CardContent>
              </Card>

              {/* Card Seguridad y Factores SSO */}
              <Card className="rounded-xl border-border bg-card shadow-xs">
                <CardHeader className="p-5 pb-3">
                  <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Key className="size-4 text-primary" />
                    Seguridad y autenticación SSO
                  </CardTitle>
                  <CardDescription className="text-xs text-muted-foreground">
                    Factores de verificación y acceso seguro
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-5 pt-0 space-y-3 text-xs">
                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-7 rounded-md bg-success/15 text-success flex items-center justify-center shrink-0">
                        <Smartphone className="size-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground truncate">Doble factor (2FA)</span>
                        <span className="text-[10px] text-muted-foreground truncate">Código por correo activo</span>
                      </div>
                    </div>
                    <Badge appearance="soft" tone="success" className="text-[10px] shrink-0">
                      Habilitado
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between py-2 border-b border-border/50">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-7 rounded-md bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Lock className="size-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground truncate">Cifrado SSO</span>
                        <span className="text-[10px] text-muted-foreground truncate">SAML 2.0 / OAuth2</span>
                      </div>
                    </div>
                    <Badge appearance="soft" tone="primary" className="text-[10px] shrink-0">
                      Activo
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between py-1.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-7 rounded-md bg-muted text-muted-foreground flex items-center justify-center shrink-0">
                        <Clock className="size-3.5" />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground truncate">Último cambio clave</span>
                        <span className="text-[10px] text-muted-foreground truncate">Hace 24 días</span>
                      </div>
                    </div>
                    <span className="font-mono text-[11px] text-muted-foreground shrink-0">19/09/2026</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── COLUMNA DERECHA (7 cols en lg / 8 cols en xl): Métricas y Tabla de Sedes y Roles ── */}
            <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-5 w-full">
              {/* 4 Mini Métricas Resumen */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                    <Building2 className="size-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-lg font-bold font-heading text-foreground leading-none">2</span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 truncate">Sedes asignadas</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success shrink-0">
                    <Layers className="size-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-lg font-bold font-heading text-foreground leading-none">7</span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 truncate">Apps activas</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-secondary-100 dark:bg-secondary-900/40 border border-secondary-300/30 flex items-center justify-center text-secondary-600 dark:text-secondary-300 shrink-0">
                    <ShieldCheck className="size-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-lg font-bold font-heading text-foreground leading-none">7</span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 truncate">Roles activos</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border bg-card shadow-xs flex items-center gap-3">
                  <div className="size-9 rounded-lg bg-info/10 border border-info/20 flex items-center justify-center text-info shrink-0">
                    <CheckCircle2 className="size-4" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-sm font-bold font-heading text-foreground leading-none">Óptima</span>
                    <span className="text-[11px] text-muted-foreground mt-0.5 truncate">Seguridad SSO</span>
                  </div>
                </div>
              </div>

              {/* Tabla de Sedes y Roles Asignados */}
              <Card className="rounded-xl border-border bg-card shadow-xs flex flex-col flex-1 overflow-hidden">
                <CardHeader className="p-5 pb-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="space-y-0.5">
                      <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
                        <Building2 className="size-4 text-primary" />
                        Sedes y roles asignados (Trazabilidad SSO)
                      </CardTitle>
                      <CardDescription className="text-xs text-muted-foreground">
                        Jurisdicciones institucionales y roles autorizados para tu usuario
                      </CardDescription>
                    </div>
                    <Badge appearance="outline" tone="neutral" className="text-[10px] font-mono">
                      7 accesos federados
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-muted/40">
                      <TableRow>
                        <TableHead className="w-[180px] pl-5 text-xs font-semibold">Sede</TableHead>
                        <TableHead className="w-[200px] text-xs font-semibold">Aplicación</TableHead>
                        <TableHead className="w-[200px] text-xs font-semibold">Rol asignado</TableHead>
                        <TableHead className="w-[90px] text-center text-xs font-semibold">Estado</TableHead>
                        <TableHead className="w-[80px] text-right pr-5 text-xs font-semibold">Acceso</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {MIS_APLICACIONES_USUARIO.map((app) => (
                        <TableRow key={app.id} className="hover:bg-muted/20 transition-colors">
                          {/* Sede */}
                          <TableCell className="pl-5 py-2.5">
                            <div className="flex items-center gap-2">
                              <div className="size-6 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                                <Building2 className="size-3" />
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span className="font-semibold text-xs text-foreground truncate max-w-[130px]" title={app.sede.nombre}>
                                  {app.sede.nombre}
                                </span>
                                <span className="text-[10px] font-mono text-muted-foreground">
                                  {app.sede.codigo}
                                </span>
                              </div>
                            </div>
                          </TableCell>

                          {/* Aplicación */}
                          <TableCell className="py-2.5">
                            <div className="flex flex-col min-w-0">
                              <span className="font-semibold text-xs text-foreground truncate max-w-[170px]" title={app.nombre}>
                                {app.nombre}
                              </span>
                              <span className="text-[10px] text-muted-foreground truncate">
                                {app.categoria}
                              </span>
                            </div>
                          </TableCell>

                          {/* Rol */}
                          <TableCell className="py-2.5">
                            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-muted/40 border border-border/60 text-[11px] font-semibold text-foreground">
                              <ShieldCheck className="size-3 text-secondary-600 dark:text-secondary-300 shrink-0" />
                              <span className="truncate max-w-[140px]" title={app.rol.nombre}>
                                {app.rol.nombre}
                              </span>
                            </div>
                          </TableCell>

                          {/* Estado */}
                          <TableCell className="text-center py-2.5">
                            <Badge
                              appearance="soft"
                              tone="success"
                              className="text-[10px] px-2 py-0 font-semibold bg-success/15 text-success-800 dark:text-success-300 border-success/30"
                            >
                              Activo
                            </Badge>
                          </TableCell>

                          {/* Acceso */}
                          <TableCell className="text-right pr-5 py-2.5">
                            <Button
                              asChild
                              variant="ghost"
                              size="icon"
                              className="size-7 text-muted-foreground hover:text-primary"
                            >
                              <a
                                href={app.urlAcceso}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Acceder a ${app.nombre}`}
                              >
                                <ExternalLink className="size-3.5" />
                              </a>
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
