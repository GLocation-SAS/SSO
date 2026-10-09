import re
with open('src/modules/auditoria/components/empty-state.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Add isLoading prop
content = content.replace('interface AuditEmptyStateProps {', 'interface AuditEmptyStateProps {\n  isLoading?: boolean;')

# import Loader2
if 'Loader2' not in content:
    content = content.replace('import { Search, FileSearch, RotateCcw } from "lucide-react";', 'import { Search, FileSearch, RotateCcw, Loader2 } from "lucide-react";')

# Change icon rendering
old_icon_block = '<FileSearch className="size-7" />'
new_icon_block = '{isLoading ? <Loader2 className="size-7 animate-spin" /> : <FileSearch className="size-7" />}'
content = content.replace(old_icon_block, new_icon_block)

# change logic
content = content.replace('export function AuditEmptyState({', 'export function AuditEmptyState({\n  isLoading,')
content = content.replace('{title}', '{isLoading ? "Cargando registros..." : title}')
content = content.replace('{description}', '{isLoading ? "Por favor, espera un momento." : description}')
content = content.replace('      {onResetFilters && (', '      {!isLoading && onResetFilters && (')

with open('src/modules/auditoria/components/empty-state.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
