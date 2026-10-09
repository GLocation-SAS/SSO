import re

with open('src/modules/auditoria/components/audit-table.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add isLoading prop to LogsTableProps
content = content.replace('interface LogsTableProps {', 'interface LogsTableProps {\n  isLoading?: boolean;')
content = content.replace('export function LogsTable({', 'export function LogsTable({\n  isLoading,')
content = content.replace('if (logs.length === 0) {', 'if (isLoading || logs.length === 0) {')
content = content.replace('<AuditEmptyState onResetFilters={onResetFilters} />', '<AuditEmptyState isLoading={isLoading} onResetFilters={onResetFilters} />')

# Add isLoading prop to AccesosTableProps
content = content.replace('interface AccesosTableProps {', 'interface AccesosTableProps {\n  isLoading?: boolean;')
content = content.replace('export function AccesosTable({', 'export function AccesosTable({\n  isLoading,')
content = content.replace('if (accesos.length === 0) {', 'if (isLoading || accesos.length === 0) {')

# Add isLoading prop to ActividadTableProps
content = content.replace('interface ActividadTableProps {', 'interface ActividadTableProps {\n  isLoading?: boolean;')
content = content.replace('export function ActividadTable({', 'export function ActividadTable({\n  isLoading,')
content = content.replace('if (actividades.length === 0) {', 'if (isLoading || actividades.length === 0) {')

with open('src/modules/auditoria/components/audit-table.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
