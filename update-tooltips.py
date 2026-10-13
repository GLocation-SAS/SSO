import re

with open('src/modules/auditoria/components/audit-table.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

def add_tooltip(match):
    inner = match.group(1)
    return f'<Tooltip><TooltipTrigger asChild><span className="font-semibold text-foreground dark:text-neutral-100 line-clamp-1 cursor-default">{inner}</span></TooltipTrigger><TooltipContent variant="info" side="top">{inner}</TooltipContent></Tooltip>'

content = re.sub(r'<span className="font-semibold text-foreground dark:text-neutral-100 line-clamp-1">\s*(.*?)\s*</span>', add_tooltip, content)

def add_tooltip_detalle(match):
    inner = match.group(1)
    return f'<Tooltip><TooltipTrigger asChild><p className="line-clamp-2 leading-relaxed cursor-default">{inner}</p></TooltipTrigger><TooltipContent variant="info" side="top" className="max-w-xs">{inner}</TooltipContent></Tooltip>'

content = re.sub(r'<p className="line-clamp-2 leading-relaxed">\s*(.*?)\s*</p>', add_tooltip_detalle, content)

with open('src/modules/auditoria/components/audit-table.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
