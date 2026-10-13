import re

with open('src/modules/auditoria/components/audit-table.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove text-[11px] font-bold uppercase tracking-wider text-white
content = re.sub(r'text-\[11px\] font-bold uppercase tracking-wider text-white', '', content)

# 2. Add InteractiveCard import if not present
if 'InteractiveCard' not in content:
    content = content.replace('import { Badge } from "@/components/ui/badge";', 'import { Badge } from "@/components/ui/badge";\nimport { InteractiveCard } from "@/components/ui/data-display";')

# 3. Remove border-t border-border bg-surface from TablePaginationBar
content = content.replace('className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 border-t border-border bg-surface"', 'className="flex flex-col sm:flex-row items-center justify-between gap-4"')

# 4. Wrap Tables
content = content.replace('<Table>', '<div className="hidden lg:block overflow-x-auto w-full">\n          <Table>')
content = content.replace('</Table>', '</Table>\n        </div>')

with open('src/modules/auditoria/components/audit-table.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
