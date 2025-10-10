"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { TUpdateOrganizationSchema } from "@/src/schemas/organization";
import { UseFormReturn } from "react-hook-form";
import { ProjectAreasCombobox } from "@/src/components/page/organization/project-areas-combobox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { canadianProvinces } from "@/src/lib/constants";

interface EditableOverviewSectionProps {
  form: UseFormReturn<TUpdateOrganizationSchema>;
  projectAreas: { value: number; label: string }[];
}

export function EditableOverviewSection({
  form,
  projectAreas,
}: EditableOverviewSectionProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 py-4">
      <FormField
        control={form.control}
        name="organizationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Organization Name
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter organization name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Street Address
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter street address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              City
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter city" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              State/Province *
            </FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <FormControl>
                <SelectTrigger className="w-full text-black">
                  <SelectValue placeholder="Select your state or province" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {canadianProvinces.map((province) => (
                  <SelectItem key={province.value} value={province.value}>
                    {province.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Country
            </FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter country" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Project Areas Combobox */}
      <div className="col-span-2">
        <FormField
          control={form.control}
          name="projectAreas"
          render={() => (
            <ProjectAreasCombobox form={form} projectAreas={projectAreas} />
          )}
        />
      </div>
    </div>
  );
}
