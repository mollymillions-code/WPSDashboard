"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"

export interface StatusOption {
  value: string
  label: string
  className: string
}

interface StatusSelectProps {
  value: string
  onValueChange: (value: string) => void
  options: StatusOption[]
  className?: string
}

export function StatusSelect({ value, onValueChange, options, className }: StatusSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            "border-sky-200 bg-sky-50 hover:bg-sky-100 hover:border-sky-300",
            "focus-visible:ring-sky-300",
            className,
          )}
        >
          {selectedOption ? (
            <Badge variant="outline" className={selectedOption.className}>
              {selectedOption.label}
            </Badge>
          ) : (
            "Select status..."
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-sky-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search status..." />
          <CommandList>
            <CommandEmpty>No status found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.value}
                  onSelect={() => {
                    onValueChange(option.value)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === option.value ? "opacity-100" : "opacity-0")} />
                  <Badge variant="outline" className={option.className}>
                    {option.label}
                  </Badge>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
