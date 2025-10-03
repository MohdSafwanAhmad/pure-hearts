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

interface EditablePrivateSectionProps {
  form: UseFormReturn<TUpdateOrganizationSchema>;
}

export function EditablePrivateSection({ form }: EditablePrivateSectionProps) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 py-4">
      <FormField
        control={form.control}
        name="contactPersonName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Person Name</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Enter contact person's name" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactPersonEmail"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Person Email</FormLabel>
            <FormControl>
              <Input
                {...field}
                type="email"
                placeholder="Enter contact person's email"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="contactPersonPhone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Contact Person Phone</FormLabel>
            <FormControl>
              <Input {...field} type="tel" placeholder="e.g. +1 234 567 890" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
