"use client"

import * as React from "react"
import {
  DayPicker,
  getDefaultClassNames,
  type DayButton,
  type Locale,
} from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon } from "lucide-react"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  locale,
  formatters,
  components,
  ...props
}: React.ComponentProps<typeof DayPicker>) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl border border-primary-400/50 shadow-2xl shadow-primary-400/20 dark:shadow-primary-400/10 transition-all duration-300 min-w-[320px]",
      className
    )}>
      {/* Top glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-2 bg-primary-400 blur-xl rounded-full" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[2px] bg-primary-400 blur-[2px] rounded-full" />

      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn(
          "group/calendar p-4 [--cell-radius:9999px] [--cell-size:2.5rem]",
          String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
          String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`
        )}
        captionLayout={captionLayout}
        locale={locale}
        formatters={{
          formatMonthDropdown: (date) =>
            date.toLocaleString(locale?.code, { month: "short" }),
          formatCaption: (date) => {
            const month = date.toLocaleString(locale?.code || 'en-US', { month: 'short' });
            const year = date.getFullYear();
            return `${month} ${year}`;
          },
          ...formatters,
        }}
        classNames={{
          root: cn("w-fit mx-auto", defaultClassNames.root),
          months: cn(
            "relative flex flex-col gap-6 md:flex-row",
            defaultClassNames.months
          ),
          month: cn("flex w-full flex-col gap-4", defaultClassNames.month),
          nav: cn(
            "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1 z-20",
            defaultClassNames.nav
          ),
          button_previous: cn(
            buttonVariants({ variant: "ghost" }),
            "size-10 rounded-full border border-border/40 p-0 select-none aria-disabled:opacity-20 hover:bg-muted/50 hover:border-border transition-colors",
            defaultClassNames.button_previous
          ),
          button_next: cn(
            buttonVariants({ variant: "ghost" }),
            "size-10 rounded-full border border-border/40 p-0 select-none aria-disabled:opacity-20 hover:bg-muted/50 hover:border-border transition-colors",
            defaultClassNames.button_next
          ),
          month_caption: cn(
            "flex h-10 w-full items-center justify-center px-10 mb-2",
            defaultClassNames.month_caption
          ),
          caption_label: cn(
            "text-base font-heading font-semibold text-foreground tracking-tight select-none",
            defaultClassNames.caption_label
          ),
          month_grid: "w-full border-collapse",
          weekdays: cn("flex mb-2", defaultClassNames.weekdays),
          weekday: cn(
            "flex-1 text-[0.7rem] font-bold text-muted-foreground/60 uppercase tracking-widest select-none",
            defaultClassNames.weekday
          ),
          week: cn("mt-1 flex w-full", defaultClassNames.week),
          day: cn(
            "group/day relative h-10 w-10 p-0 text-center select-none",
            defaultClassNames.day
          ),
          today: cn(
            "text-primary font-bold after:absolute after:bottom-1 after:left-1/2 after:-translate-x-1/2 after:size-1 after:rounded-full after:bg-primary",
            defaultClassNames.today
          ),
          outside: cn(
            "text-muted-foreground/30 aria-selected:text-muted-foreground/50",
            defaultClassNames.outside
          ),
          disabled: cn(
            "text-muted-foreground/20 opacity-50",
            defaultClassNames.disabled
          ),
          hidden: cn("invisible", defaultClassNames.hidden),
          ...classNames,
        }}
        components={{
          Chevron: ({ className, orientation, ...props }) => {
            if (orientation === "left") {
              return (
                <ChevronLeftIcon className={cn("size-4 text-foreground/70", className)} {...props} />
              )
            }

            if (orientation === "right") {
              return (
                <ChevronRightIcon className={cn("size-4 text-foreground/70", className)} {...props} />
              )
            }

            return (
              <ChevronDownIcon className={cn("size-4 text-foreground/70", className)} {...props} />
            )
          },
          DayButton: ({ ...props }) => (
            <CalendarDayButton locale={locale} {...props} />
          ),
          ...components,
        }}
        {...props}
      />
    </div>
  )
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  locale,
  ...props
}: React.ComponentProps<typeof DayButton> & { locale?: Partial<Locale> }) {
  const ref = React.useRef<HTMLButtonElement>(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  const isSelected = modifiers.selected &&
    !modifiers.range_start &&
    !modifiers.range_end &&
    !modifiers.range_middle;

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString(locale?.code)}
      data-selected-single={isSelected}
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "relative isolate z-10 flex size-10 items-center justify-center rounded-full border-0 leading-none font-medium transition-all duration-300",
        "hover:bg-primary/50 hover:text-foreground",
        isSelected && [
          "bg-primary-400 dark:bg-primary-500 text-white shadow-lg shadow-primary-400/40",
          "after:absolute after:inset-0 after:rounded-full after:bg-primary-400/30 after:blur-md after:-z-10",
          "scale-110 font-bold"
        ],
        modifiers.range_start && [
          "!rounded-r-none bg-primary text-white",
          "before:absolute before:inset-0 before:right-[-50%] before:bg-primary/20 before:-z-10"
        ],
        modifiers.range_end && [
          "!rounded-l-none bg-primary text-white",
          "before:absolute before:inset-0 before:left-[-50%] before:bg-primary/20 before:-z-10"
        ],
        modifiers.range_middle && "!rounded-none bg-primary/20 text-foreground hover:bg-primary/30 w-full",
        className
      )}
      {...props}
    />
  )
}

export { Calendar, CalendarDayButton }
