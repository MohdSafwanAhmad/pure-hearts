import { UseFormReturn } from "react-hook-form";
import { TUpdateOrganizationSchema } from "@/src/schemas/organization";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";

interface EditableContactSectionProps {
  form: UseFormReturn<TUpdateOrganizationSchema>;
}

const contactFields = [
  {
    name: "organizationPhone",
    label: "Organization Phone",
    type: "tel",
    placeholder: "e.g. +1 234 567 890",
  },
  {
    name: "websiteUrl",
    label: "Website",
    type: "url",
    placeholder: "e.g. https://example.com",
  },
  {
    name: "facebookUrl",
    label: "Facebook",
    type: "url",
    placeholder: "e.g. https://facebook.com/yourpage",
  },
  {
    name: "twitterUrl",
    label: "Twitter",
    type: "url",
    placeholder: "e.g. https://twitter.com/yourhandle",
  },
  {
    name: "instagramUrl",
    label: "Instagram",
    type: "url",
    placeholder: "e.g. https://instagram.com/yourprofile",
  },
  {
    name: "linkedinUrl",
    label: "LinkedIn",
    type: "url",
    placeholder: "e.g. https://linkedin.com/in/yourprofile",
  },
];

export function EditableContactSection({ form }: EditableContactSectionProps) {
  return (
    <div className="grid gap-x-6 grid-cols-1 sm:grid-cols-2 divide-y">
      {contactFields.map((field) => (
        <div key={field.name} className="py-4">
          <FormField
            control={form.control}
            name={field.name as keyof TUpdateOrganizationSchema}
            render={({ field: formField }) => (
              <FormItem>
                <FormLabel>{field.label}</FormLabel>
                <FormControl>
                  <Input
                    {...formField}
                    type={field.type}
                    value={formField.value || ""}
                    placeholder={field.placeholder}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
    </div>
  );
}
