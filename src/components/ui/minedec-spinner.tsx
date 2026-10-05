import React from "react";
import { cn } from "@/lib/utils";

export type MinedecSpinnerProps = {
  size?: "sm" | "md" | "lg";
  label?: string;
  className?: string;
  hideLabel?: boolean;
};

export function MinedecSpinner({
  size = "md",
  label = "Cargando información",
  className = "",
  hideLabel = false,
}: MinedecSpinnerProps) {
  const sizeMap = {
    sm: 64,
    md: 96,
    lg: 140,
  };

  const logoMap = {
    sm: 32,
    md: 52,
    lg: 80,
  };

  const spinnerSize = sizeMap[size];
  const logoSize = logoMap[size];

  return (
    <div className={cn("flex flex-col items-center justify-center gap-4", className)}>
      <div
        className="minedec-spinner"
        style={{
          width: spinnerSize,
          height: spinnerSize,
        }}
        role="status"
        aria-label={label}
      >
        <div className="minedec-spinner__ring" aria-hidden="true" />

        <img
          className="minedec-spinner__shield dark:hidden"
          src="/escudo-light.svg"
          alt=""
          aria-hidden="true"
          style={{
            width: logoSize,
            height: logoSize,
          }}
        />
        
        <img
          className="minedec-spinner__shield hidden dark:block"
          src="/escudo-dark.svg"
          alt=""
          aria-hidden="true"
          style={{
            width: logoSize,
            height: logoSize,
          }}
        />
      </div>

      {!hideLabel && label && (
        <span className="text-sm font-medium text-muted-foreground animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
}
