import { ProjectAreasCombobox } from "@/src/components/page/signup/project-areas-combobox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { TCreateOrganizationSchema } from "@/src/schemas/organization";
import { UseFormReturn } from "react-hook-form";

interface Props {
  form: UseFormReturn<TCreateOrganizationSchema>;
  projectAreas: { label: string; value: number }[];
}

export function MissionProjectsSection({ form, projectAreas }: Props) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="missionStatement"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Mission Statement *
            </FormLabel>
            <FormControl>
              <Textarea
                {...field}
                placeholder="Describe your organization's mission and goals..."
                className={
                  form.formState.errors?.missionStatement
                    ? "border-red-500"
                    : ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <ProjectAreasCombobox form={form} projectAreas={projectAreas} />

      <FormField
        control={form.control}
        name="websiteUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Website URL
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="url"
                placeholder="https://www.yourorganization.org"
                className={
                  form.formState.errors?.websiteUrl ? "border-red-500" : ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="facebookUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Facebook URL
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="url"
                placeholder="https://www.facebook.com/yourorganization"
                className={
                  form.formState.errors?.facebookUrl ? "border-red-500" : ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="twitterUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Twitter URL
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="url"
                placeholder="https://twitter.com/yourorganization"
                className={
                  form.formState.errors?.twitterUrl ? "border-red-500" : ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="instagramUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Instagram URL
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="url"
                placeholder="https://www.instagram.com/yourorganization"
                className={
                  form.formState.errors?.instagramUrl ? "border-red-500" : ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="linkedinUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              LinkedIn URL
            </FormLabel>
            <FormControl>
              <Input
                {...field}
                type="url"
                placeholder="https://www.linkedin.com/company/yourorganization"
                className={
                  form.formState.errors?.linkedinUrl ? "border-red-500" : ""
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
