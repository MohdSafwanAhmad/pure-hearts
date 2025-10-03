"use client";

import * as React from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";

import { cn } from "@/src/lib/utils";
import { Button } from "@/src/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/src/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Badge } from "@/src/components/ui/badge";
import { projectAreaOptions } from "@/src/types/auth-organizations-types";
import { UseFormReturn } from "react-hook-form";
import { TOrganizationSchema } from "@/src/schemas/organization";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

interface ProjectAreasComboboxProps {
  form: UseFormReturn<TOrganizationSchema>;
}

export function ProjectAreasCombobox({ form }: ProjectAreasComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Get current values from form
  const selectedAreas = form.watch("projectAreas") || [];

  // We'll now show all options but disable the selected ones
  // (keeping this variable for button text)

  const handleSelect = (value: string) => {
    const currentValues = [...selectedAreas];
    currentValues.push(value);

    form.setValue("projectAreas", currentValues, {
      shouldValidate: true,
      shouldDirty: true,
    });

    // Keep the popover open
  };

  const handleRemove = (value: string) => {
    const currentValues = selectedAreas.filter((area) => area !== value);

    form.setValue("projectAreas", currentValues, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  return (
    <FormItem>
      <FormLabel>Project Areas</FormLabel>
      <FormControl>
        <div className="flex flex-col gap-4">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={cn(
                  "w-full justify-between text-left",
                  selectedAreas.length === 0 ? "text-muted-foreground" : ""
                )}
                disabled={selectedAreas.length === projectAreaOptions.length}
              >
                {selectedAreas.length === projectAreaOptions.length
                  ? "All areas selected"
                  : "Click to select project areas..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className="w-[var(--radix-popover-trigger-width)]"
              align="start"
            >
              <Command>
                <CommandInput
                  placeholder="Type to search areas..."
                  className="h-9"
                />
                <CommandList>
                  <CommandEmpty>No matching areas found.</CommandEmpty>
                  <CommandGroup>
                    {projectAreaOptions.map((area) => (
                      <CommandItem
                        key={area}
                        value={area}
                        onSelect={() => {
                          // Toggle selection: select if not selected, remove if already selected
                          if (selectedAreas.includes(area)) {
                            handleRemove(area);
                          } else {
                            handleSelect(area);
                          }
                        }}
                        className={
                          selectedAreas.includes(area) ? "opacity-90" : ""
                        }
                      >
                        {area}
                        <Check
                          className={cn(
                            "ml-auto h-4 w-4",
                            selectedAreas.includes(area)
                              ? "opacity-100 text-primary"
                              : "opacity-0"
                          )}
                        />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

          {selectedAreas.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {selectedAreas.map((area) => (
                <Badge
                  key={area}
                  variant="secondary"
                  className="text-sm py-1 pl-2 pr-2 flex items-center gap-1 cursor-pointer hover:bg-muted/80 transition-colors duration-200 group relative"
                  onClick={() => handleRemove(area)}
                  title="Click to remove"
                >
                  {area}
                  <X className="h-3 w-3 group-hover:text-foreground/80" />
                </Badge>
              ))}
            </div>
          )}
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}
