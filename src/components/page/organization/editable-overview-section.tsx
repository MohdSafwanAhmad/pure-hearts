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
import { ProjectAreasCombobox } from "./project-areas-combobox";

interface EditableOverviewSectionProps {
  form: UseFormReturn<TUpdateOrganizationSchema>;
}

export function EditableOverviewSection({
  form,
}: EditableOverviewSectionProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 py-4">
      <FormField
        control={form.control}
        name="organizationName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Organization Name</FormLabel>
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
            <FormLabel>Street Address</FormLabel>
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
            <FormLabel>City</FormLabel>
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
            <FormLabel>Province/State</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter province or state" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Country</FormLabel>
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
          render={() => <ProjectAreasCombobox form={form} />}
        />
      </div>
    </div>
  );
}
