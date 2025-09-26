import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Checkbox } from "@/src/components/ui/checkbox";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { projectAreaOptions } from "@/src/types/auth-organizations-types";

import { UseFormReturn } from "react-hook-form";

import { TOrganizationSchema } from "@/src/schemas/organization";

interface MissionProjectsSectionProps {
  form: UseFormReturn<TOrganizationSchema>;
}

export function MissionProjectsSection({ form }: MissionProjectsSectionProps) {
  const onProjectAreaChange = (area: string, checked: boolean) => {
    const current = form.getValues("projectAreas") || [];
    const updated = checked
      ? [...current, area]
      : current.filter((a) => a !== area);
    form.setValue("projectAreas", updated, {
      shouldValidate: true,
      shouldDirty: true,
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl font-semibold">
          Mission & Projects
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
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

        <div className="space-y-4">
          <div>
            <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              Project Areas *
            </Label>
            <p className="text-xs text-muted-foreground mt-1">
              Select the areas your organization works in
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-gray-50 dark:bg-gray-900">
            {projectAreaOptions.map((area) => (
              <div key={area} className="flex items-center space-x-2">
                <Checkbox
                  id={area}
                  checked={
                    form.getValues("projectAreas")?.includes(area) || false
                  }
                  onCheckedChange={(checked) =>
                    onProjectAreaChange(area, checked as boolean)
                  }
                />
                <Label htmlFor={area} className="text-sm font-medium">
                  {area}
                </Label>
              </div>
            ))}
          </div>
          {form.formState.errors?.projectAreas && (
            <p className="text-sm text-red-500">
              {form.formState.errors.projectAreas.message}
            </p>
          )}
        </div>

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
      </CardContent>
    </Card>
  );
}
