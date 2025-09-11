'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export interface ComboboxOption {
  value: string;
  label: string;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyPlaceholder?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export function Combobox({
  options,
  value,
  onChange,
  placeholder = 'Select option...',
  searchPlaceholder = 'Search options...',
  emptyPlaceholder = 'No option found.',
  disabled = false,
  className,
  triggerClassName,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn('w-full justify-between', triggerClassName)}
          disabled={disabled}
        >
          {selectedOption ? selectedOption.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn('w-[--radix-popover-trigger-width] p-0 z-50', className)}
        side="bottom"
        align="start"
        sideOffset={4}
        collisionPadding={10}
        avoidCollisions={true}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyPlaceholder}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // Use label for filtering/searching
                  keywords={[option.value, option.label]} // Add keywords for better search
                  onSelect={(currentValue) => {
                    // Find the option by matching the label
                    const selectedOpt = options.find(
                      (opt) => opt.label.toLowerCase() === currentValue.toLowerCase()
                    );
                    if (selectedOpt) {
                      onChange(selectedOpt.value);
                      setOpen(false);
                    }
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      value === option.value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
