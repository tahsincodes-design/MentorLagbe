"use client"

import { useId } from "react"

import { Input } from "@/components/ui/input"
import { parseMonthlyFee, type TuitionSearch } from "@/lib/tuitions/search"
import { cn } from "@/lib/utils"

export const tuitionSelectClass =
  "h-10 w-full min-w-0 rounded-xl border border-input bg-background px-3 text-sm text-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"

type FilterOption = [value: string, label: string]

export function TuitionFilters({
  filters,
  subjects,
  locations,
  onChange,
  className,
}: {
  filters: TuitionSearch
  subjects: FilterOption[]
  locations: FilterOption[]
  onChange: (field: keyof TuitionSearch, value: string) => void
  className?: string
}) {
  const errorId = useId()
  const min = parseMonthlyFee(filters.min)
  const max = parseMonthlyFee(filters.max)
  const invalidRange = min !== null && max !== null && min > max

  return (
    <div className={cn("grid gap-3", className)}>
      <FilterSelect
        label="Subject"
        allLabel="All subjects"
        options={subjects}
        value={filters.subject}
        onChange={(value) => onChange("subject", value)}
      />
      <FilterSelect
        label="Location"
        allLabel="All locations"
        options={locations}
        value={filters.location}
        onChange={(value) => onChange("location", value)}
      />
      <fieldset className="grid min-w-0 grid-cols-2 gap-x-2 sm:col-span-2">
        <legend className="mb-1 text-sm font-medium">Monthly fee (৳)</legend>
        {(["min", "max"] as const).map((field) => (
          <label key={field} className="min-w-0">
            <span className="sr-only">
              {field === "min" ? "Minimum monthly fee" : "Maximum monthly fee"}
            </span>
            <Input
              inputMode="decimal"
              maxLength={16}
              value={filters[field]}
              onChange={({ target }) => {
                if (/^\d*(?:\.\d*)?$/.test(target.value)) {
                  onChange(field, target.value)
                }
              }}
              placeholder={field === "min" ? "Min" : "Max"}
              aria-invalid={invalidRange || undefined}
              aria-describedby={invalidRange ? errorId : undefined}
              className="h-10 rounded-xl"
            />
          </label>
        ))}
        {invalidRange ? (
          <p
            id={errorId}
            role="alert"
            className="col-span-2 mt-1 text-sm text-destructive"
          >
            Enter a maximum fee at least as high as the minimum.
          </p>
        ) : null}
      </fieldset>
    </div>
  )
}

function FilterSelect({
  label,
  allLabel,
  value,
  options,
  onChange,
}: {
  label: string
  allLabel: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}) {
  return (
    <label className="grid min-w-0 gap-1 text-sm font-medium">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={tuitionSelectClass}
      >
        <option value="">{allLabel}</option>
        {value && !options.some(([key]) => key === value) ? (
          <option value={value}>{value}</option>
        ) : null}
        {options.map(([key, text]) => (
          <option key={key} value={key}>
            {text}
          </option>
        ))}
      </select>
    </label>
  )
}
