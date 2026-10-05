"use client";

import React, { useRef, KeyboardEvent, ClipboardEvent } from "react";
import { cn } from "@/lib/utils";

interface VerificationCodeInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean;
}

export function VerificationCodeInput({
  length = 6,
  value,
  onChange,
  disabled = false,
  error = false,
}: VerificationCodeInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!/^\d*$/.test(inputValue)) return;
    
    const newValue = value.split("");
    newValue[index] = inputValue.slice(-1);
    const combined = newValue.join("").slice(0, length);
    onChange(combined);

    if (inputValue !== "" && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (value[index] === undefined || value[index] === "") {
        if (index > 0) {
          inputsRef.current[index - 1]?.focus();
          const newValue = value.split("");
          newValue[index - 1] = "";
          onChange(newValue.join(""));
        }
      } else {
        const newValue = value.split("");
        newValue[index] = "";
        onChange(newValue.join(""));
      }
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pastedData) {
      onChange(pastedData);
      const nextIndex = Math.min(pastedData.length, length - 1);
      inputsRef.current[nextIndex]?.focus();
    }
  };

  return (
    <div className="flex justify-between gap-2">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={2}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "flex h-12 w-10 sm:w-14 sm:h-14 rounded-md border px-3 py-2 text-center text-lg font-semibold font-sans ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 ease-in-out",
            error ? "border-danger focus-visible:ring-danger" : "border-input",
            value[index] 
              ? "border-primary bg-primary/10 text-primary scale-105 shadow-sm" 
              : "bg-background scale-100"
          )}
        />
      ))}
    </div>
  );
}
