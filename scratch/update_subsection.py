import os
import re

# Map of section/subsection IDs to their corresponding Lucide icons
ICON_MAP = {
    "foundations-logos": "ImageIcon",
    "foundations-colors": "Palette",
    "foundations-scales": "Sliders",
    "foundations-typography": "Type",
    "foundations-shadows": "Layers",
    "foundations-radius": "Box",
    "header": "Layout",
    "sidebar-nav": "Sidebar",
    "breadcrumb": "FolderOpen",
    "tabs": "Folder",
    "pagination": "ChevronLeft",
    "stepper": "ListTodo",
    "user-menu": "User",
    "notifications-menu": "Bell",
    "avatar": "UserCircle",
    "button": "MousePointerClick",
    "link": "Link",
    "text-field": "TextCursorInput",
    "textarea": "AlignLeft",
    "search-field": "Search",
    "number-field": "Hash",
    "combobox": "FormInput",
    "multiselect": "ListFilter",
    "checkbox": "CheckSquare",
    "radio-button": "CircleDot",
    "switch": "ToggleLeft",
    "date-picker": "Calendar",
    "date-range": "CalendarRange",
    "file-input": "UploadCloud",
    "base-card": "CreditCard",
    "interactive-card": "Pointer",
    "kpi-card": "TrendingUp",
    "institution-card": "Building",
    "layer-card": "Layers",
    "document-card": "FileText",
    "report-card": "FileSpreadsheet",
    "badge": "Award",
    "chip": "Tag",
    "metadata-list": "List",
    "status-indicator": "Activity",
    "data-table": "Table",
    "expandable-row": "Rows",
    "column-selector": "Columns",
    "mobile-card-row": "Smartphone",
    "banners-alerts": "AlertTriangle",
    "loading-states": "Loader2",
    "empty-states": "Inbox",
    "toast": "MessageSquare",
    "tooltip": "HelpCircle",
    "modal-base": "ExternalLink",
    "dialog": "SquareTerminal",
    "file-upload-widgets": "Upload",
    "validation-mapping": "CheckCircle2",
    "processing-history": "History",
    "folders": "Folder",
    "map-container": "Map",
    "layers-panel": "Layers",
    "map-popup": "MapPin",
    "risk-badge": "ShieldAlert",
    "risk-scale": "BarChart2",
    "criticality-badge": "AlertOctagon",
    "charts-group": "PieChart",
    "trend-indicator": "ArrowUpRight",
    "interpretation-card": "Info",
    "export-button": "Download",
    "export-menu": "Share2",
    "report-preview": "Eye",
    "report-status": "Clock",
    "download-list": "ListOrdered",
    "chat-launcher": "MessageCircle",
    "chat-panel": "MessagesSquare",
    "rich-result": "Sparkles",
    "chat-states": "ShieldQuestion",
    "chat-assistant": "Bot",
    "chat-intranet": "Building2",
    "public-header": "Globe",
    "public-search": "Search",
    "faq-accordion": "HelpCircle",
    "public-footer": "Footprints",
    "user-table": "Users",
    "user-form": "UserPlus",
    "permission-matrix": "Shield",
    "audit-log": "History"
}

dir_path = "src/modules/uikit/components"

for filename in os.listdir(dir_path):
    if not filename.endswith("-showcase.tsx") and filename != "style-guide.tsx":
        continue
        
    filepath = os.path.join(dir_path, filename)
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()
        
    # Check if this file defines SubSectionProps and SubSection
    if "interface SubSectionProps" not in content or "function SubSection" not in content:
        continue
        
    print(f"Processing {filename}...")
    
    # 1. Update SubSectionProps definition
    content = content.replace(
        "interface SubSectionProps {",
        "interface SubSectionProps {\n  icon?: React.ElementType;"
    )
    
    # 2. Update SubSection function signature and return statement to destructure and render icon
    # Find SubSection parameter destructuring
    sub_def_pattern = r"function SubSection\(\{([^}]+)\}\s*:\s*SubSectionProps\)"
    match = re.search(sub_def_pattern, content)
    if match:
        params = match.group(1).strip()
        if "icon" not in params:
            # Add icon to destructuring
            new_params = f"{params}, icon: Icon"
            content = content.replace(match.group(0), f"function SubSection({{{new_params}}} : SubSectionProps)")
            
    # Find h3 title rendering inside SubSection and insert the icon
    h3_pattern = r"(<h3[^>]*>)\s*\{?title\}?\s*(</h3>)"
    h3_match = re.search(h3_pattern, content)
    if h3_match:
        content = content.replace(
            h3_match.group(0),
            h3_match.group(1) + "\n          {Icon && <Icon className=\"size-7 text-secondary shrink-0\" strokeWidth={2.5} />}\n          {title}" + h3_match.group(2)
        )
        
    # Let's clean up any double if checks we did earlier
    content = content.replace("if (id) if (id) registerSection?.(id, el);", "if (id) registerSection?.(id, el);")

    # 3. Add icons to SubSection calls
    icons_needed = set()
    
    # We find all occurrences of <SubSection and check the id parameter
    # Let's use a pattern that matches the opening tag of SubSection
    # e.g., <SubSection ... id="xxx" ... >
    def replace_subsection_tag(m):
        tag_content = m.group(1)
        # Find the id attribute
        id_match = re.search(r'id=["\']([^"\']+)["\']', tag_content)
        if id_match:
            sub_id = id_match.group(1)
            icon_name = ICON_MAP.get(sub_id)
            if icon_name and "icon=" not in tag_content:
                icons_needed.add(icon_name)
                # Insert icon={IconName} before id="..."
                return f"<SubSection\n          icon={{{icon_name}}}\n          " + tag_content.strip() + "\n        >"
        return m.group(0)

    content = re.sub(r"<SubSection\s+([^>]+)>", replace_subsection_tag, content)
    
    # 4. Add imported icons from lucide-react at the top of the file
    if icons_needed:
        # Find import from "lucide-react"
        lucide_import_pattern = r'import\s+\{([^}]+)\}\s+from\s+["\']lucide-react["\']'
        lucide_match = re.search(lucide_import_pattern, content)
        if lucide_match:
            imported_names = [name.strip() for name in lucide_match.group(1).split(",")]
            for icon in icons_needed:
                if icon not in imported_names:
                    imported_names.append(icon)
            new_import = "import { " + ", ".join(imported_names) + " } from \"lucide-react\""
            content = content.replace(lucide_match.group(0), new_import)
        else:
            # Create a new import line
            new_import = "import { " + ", ".join(icons_needed) + " } from \"lucide-react\";\n"
            content = new_import + content
            
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        
print("SubSections updated successfully!")
