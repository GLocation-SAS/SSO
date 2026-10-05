import React from "react";
import { UIKitContext } from "../views/uikit-view";

export interface SubSectionProps {
  icon?: React.ElementType;
  id?: string;
  title: string;
  description?: string | React.ReactNode;
  children: React.ReactNode;
  registerSection?: (id: string, el: HTMLElement | null) => void;
  isEditable?: boolean;
}

export function SubSection({ id, title, description, children, registerSection, icon: Icon, isEditable }: SubSectionProps) {
  const { showOnlyEditable } = React.useContext(UIKitContext);

  if (showOnlyEditable && !isEditable) {
    return null;
  }

  return (
    <section
      id={id}
      ref={(el) => {
        if (id) registerSection?.(id, el);
      }}
      className="w-full bg-surface border border-border/50 rounded-[2rem] p-8 md:p-10 flex flex-col shadow-sm scroll-mt-24"
    >
      <div className="flex flex-col gap-2 mb-8">
        <h3 className="text-h3 font-heading font-bold text-foreground flex items-center gap-3">
          {Icon && <Icon className="size-7 text-secondary shrink-0" strokeWidth={2.5} />}
          {title}</h3>
        {description && <div className="text-sm text-muted-foreground leading-relaxed">{description}</div>}
      </div>
      <div className="w-full">
        {children}
      </div>
    </section>
  );
}
