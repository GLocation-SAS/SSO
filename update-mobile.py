# -*- coding: utf-8 -*-
with open('src/modules/auditoria/components/audit-table.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

def insert_after(lines, search_str, insert_str):
    for i, line in enumerate(lines):
        if search_str in line:
            lines.insert(i + 1, insert_str)
            return
            
logs_mobile = """
        {/* Mobile Card Row (Responsive) */}
        <div className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {paginatedLogs.map((log) => (
            <InteractiveCard
              key={log.id}
              className="flex flex-col gap-3 text-left"
              color="default"
              hideChevron
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">{log.responsable.nombre}</span>
                  <span className="text-xs text-muted-foreground">{log.fechaRelativa}</span>
                </div>
                <StatusBadge status={log.accion} />
              </div>
              <div className="text-xs text-muted-foreground line-clamp-2">
                {log.detalleBreve}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[11px]">Elemento</span>
                  <span className="text-foreground font-medium truncate">{log.elementoNombre}</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[11px]">Estado</span>
                  <StatusBadge status={log.estado} />
                </div>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-end">
                <Button variant="ghost" size="icon" onClick={() => onViewDetail(log)} className="size-8 text-muted-foreground hover:text-primary"><Eye className="size-4" /></Button>
              </div>
            </InteractiveCard>
          ))}
        </div>
"""

accesos_mobile = """
        {/* Mobile Card Row (Responsive) */}
        <div className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {paginatedAccesos.map((acc) => (
            <InteractiveCard
              key={acc.id}
              className="flex flex-col gap-3 text-left"
              color="default"
              hideChevron
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">{acc.usuario.nombre}</span>
                  <span className="text-xs text-muted-foreground">{acc.fechaRelativa}</span>
                </div>
                <StatusBadge status={acc.resultado} />
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[11px]">Aplicación</span>
                  <span className="text-foreground font-medium truncate">{acc.aplicacion}</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[11px]">Rol</span>
                  <span className="text-foreground font-medium">{acc.rol}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border/60 flex items-center justify-end">
                <Button variant="ghost" size="icon" onClick={() => onViewDetail(acc)} className="size-8 text-muted-foreground hover:text-primary"><Eye className="size-4" /></Button>
              </div>
            </InteractiveCard>
          ))}
        </div>
"""

actividad_mobile = """
        {/* Mobile Card Row (Responsive) */}
        <div className="grid lg:hidden grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {paginatedItems.map((act) => (
            <InteractiveCard
              key={act.id}
              className="flex flex-col gap-3 text-left"
              color="default"
              hideChevron
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col">
                  <span className="font-bold text-sm text-foreground">{act.usuario.nombre}</span>
                  <span className="text-xs text-muted-foreground">{act.ultimaActividadRelativa}</span>
                </div>
                <span className="inline-block font-mono font-bold px-2.5 py-0.5 rounded-full text-xs bg-muted text-foreground">
                  {act.totalAccesos} acc
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border/60">
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[11px]">Sede</span>
                  <span className="text-foreground font-medium truncate">{act.sede}</span>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <span className="text-muted-foreground font-semibold flex items-center gap-1 text-[11px]">Rol</span>
                  <span className="text-foreground font-medium">{act.rolPrincipal}</span>
                </div>
              </div>
              <div className="pt-2 border-t border-border/60 flex flex-wrap gap-1">
                {act.aplicacionesUtilizadas.map((app) => (
                  <Badge key={app} tone="neutral" appearance="soft" size="sm" className="text-[10px]">{app}</Badge>
                ))}
              </div>
            </InteractiveCard>
          ))}
        </div>
"""

# Insert for LogsTable (line ~206)
insert_after(lines, '        </div>', logs_mobile)
# Insert for AccesosTable
for i, line in enumerate(lines):
    if '          </Table>' in line and i > 250 and i < 450:
        lines.insert(i + 2, accesos_mobile)
        break

# Insert for ActividadTable
for i, line in enumerate(lines):
    if '          </Table>' in line and i > 450:
        lines.insert(i + 2, actividad_mobile)
        break

with open('src/modules/auditoria/components/audit-table.tsx', 'w', encoding='utf-8') as f:
    f.writelines(lines)
