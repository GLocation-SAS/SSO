const fs = require('fs');
let content = fs.readFileSync('src/modules/auditoria/components/audit-table.tsx', 'utf-8');

// 1. Remove text-[11px] font-bold uppercase tracking-wider text-white
content = content.replace(/text-\[11px\] font-bold uppercase tracking-wider text-white/g, '');

// 2. Add InteractiveCard import if not present
if (!content.includes('InteractiveCard')) {
  content = content.replace('import { Badge } from "@/components/ui/badge";', 'import { Badge } from "@/components/ui/badge";\nimport { InteractiveCard } from "@/components/ui/data-display";');
}

// 3. Remove border-t border-border bg-surface from TablePaginationBar
content = content.replace(/className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-3 border-t border-border bg-surface"/g, 'className="flex flex-col sm:flex-row items-center justify-between gap-4"');

// 4. Wrap Tables
content = content.replace(/<Table>/g, '<div className="hidden lg:block overflow-x-auto w-full">\n          <Table>');
content = content.replace(/<\/Table>/g, '</Table>\n        </div>');

fs.writeFileSync('src/modules/auditoria/components/audit-table.tsx', content);
