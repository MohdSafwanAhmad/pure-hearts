"use client";

import { Badge } from "@/src/components/ui/badge";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { MultiSelectCombobox } from "@/src/components/ui/multi-select-combobox";
import { TCreateOrganizationSchema } from "@/src/schemas/organization";
import { X } from "lucide-react";
import { UseFormReturn } from "react-hook-form";

interface ProjectAreasComboboxProps {
  form: UseFormReturn<TCreateOrganizationSchema>;
  projectAreas: { label: string; value: number }[];
}

export function ProjectAreasCombobox({
  form,
  projectAreas,
}: ProjectAreasComboboxProps) {
  // Get current values from form
  const selectedAreas = form.watch("projectAreas") || [];

  const handleSelect = (value: number | string) => {
    const currentValues = [...selectedAreas];
    const numValue = typeof value === "string" ? parseInt(value) : value;

    if (currentValues.includes(numValue)) {
      // Remove if already selected
      form.setValue(
        "projectAreas",
        currentValues.filter((v) => v !== numValue),
        {
          shouldValidate: true,
          shouldDirty: true,
        }
      );
    } else if (!isNaN(numValue)) {
      // Add if not selected
      currentValues.push(numValue);
      form.setValue("projectAreas", currentValues, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  };

  const handleRemove = (value: number) => {
    const currentValues = selectedAreas.filter((area) => area !== value);
    form.setValue("projectAreas", currentValues, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };

  const getLabel = (value: number): string => {
    const option = projectAreas.find((opt) => opt.value === value);
    return option?.label || String(value);
  };

  return (
    <FormField
      control={form.control}
      name="projectAreas"
      render={() => (
        <FormItem>
          <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Mission Statement *
          </FormLabel>
          <FormControl>
            <div className="flex flex-col gap-4">
              <MultiSelectCombobox
                options={projectAreas}
                selectedValues={selectedAreas}
                onSelect={handleSelect}
                placeholder="Click to select project areas..."
                searchPlaceholder="Type to search areas..."
                emptyText="No matching areas found."
                className={
                  form.formState.errors?.missionStatement
                    ? "border-red-500"
                    : ""
                }
              />

              {selectedAreas.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {selectedAreas.map((value) => (
                    <Badge
                      key={value}
                      variant="secondary"
                      className="text-sm py-1 pl-2 pr-2 flex items-center gap-1 cursor-pointer hover:bg-muted/80 transition-colors duration-200 group relative"
                      onClick={() => handleRemove(value)}
                      title="Click to remove"
                    >
                      {getLabel(value)}
                      <X className="h-3 w-3 group-hover:text-foreground/80" />
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
