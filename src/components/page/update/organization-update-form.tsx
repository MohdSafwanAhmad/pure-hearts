"use client";

import { updateOrganization } from "@/src/actions/update-organization";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Separator } from "@/src/components/ui/separator";
import {
  organizationSchema,
  TOrganizationSchema,
} from "@/src/schemas/organization";
import {
  canadianProvinces,
  projectAreaOptions,
} from "@/src/types/auth-organizations-types";
import { Database } from "@/src/types/database-types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Textarea } from "@/src/components/ui/textarea";
import { Checkbox } from "../../ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { toast } from "sonner";

type OrganizationData = Database["public"]["Tables"]["organizations"]["Row"];

interface OrganizationUpdateFormProps {
  initialData: OrganizationData;
}

function parseProjectAreas(projectAreas: unknown): string[] {
  if (Array.isArray(projectAreas)) {
    return projectAreas.filter((v) => typeof v === "string");
  }
  if (typeof projectAreas === "string") {
    try {
      const parsed = JSON.parse(projectAreas);
      if (Array.isArray(parsed)) {
        return parsed.filter((v) => typeof v === "string");
      }
    } catch {
      return [];
    }
  }
  return [];
}

export function OrganizationUpdateForm({
  initialData,
}: OrganizationUpdateFormProps) {
  const form = useForm<TOrganizationSchema>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      organizationName: initialData.organization_name || "",
      organizationPhone: initialData.organization_phone || "",
      contactPersonName: initialData.contact_person_name || "",
      contactPersonEmail: initialData.contact_person_email || "",
      contactPersonPhone: initialData.contact_person_phone || "",
      country: initialData.country || "Canada",
      state: initialData.state || "",
      city: initialData.city || "",
      address: initialData.address || "",
      missionStatement: initialData.mission_statement || "",
      projectAreas: parseProjectAreas(initialData.project_areas),
      websiteUrl: initialData.website_url || "",
      facebookUrl: initialData.facebook_url || "",
      twitterUrl: initialData.twitter_url || "",
      instagramUrl: initialData.instagram_url || "",
      linkedinUrl: initialData.linkedin_url || "",
    },
  });

  const onSubmit = async (data: TOrganizationSchema) => {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (key === "projectAreas") {
        formData.append(key, JSON.stringify(value));
      } else {
        if (!Array.isArray(value)) formData.append(key, value ?? "");
      }
    });

    const res = await updateOrganization(formData);

    if (res.success) {
      toast.success("Organization information updated successfully");
      form.reset(data);
    }

    if (res.error) {
      toast.error(res.error);
    }
  };

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

  // Reset to initialData
  const handleReset = () => {
    form.reset();
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Update Organization Information
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Modify your organization details and save changes
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Basic Information Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="organizationName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Organization Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Your Organization Name"
                          className={
                            form.formState.errors?.organizationName
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-3">
                <FormField
                  control={form.control}
                  name="organizationPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        Organization Phone *
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="tel"
                          placeholder="+15554443333"
                          className={
                            form.formState.errors?.organizationPhone
                              ? "border-red-500"
                              : ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <Label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Contact Person Information *
                </Label>
                <div className="space-y-4 pl-4 border-l-2 border-gray-200 dark:border-gray-700">
                  <FormField
                    control={form.control}
                    name="contactPersonName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Contact Person Name *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="text"
                            placeholder="Your Organization Name"
                            className={
                              form.formState.errors?.contactPersonName
                                ? "border-red-500"
                                : ""
                            }
                          />
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
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Email Address *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="Contact person email"
                            className={
                              form.formState.errors?.contactPersonEmail
                                ? "border-red-500"
                                : ""
                            }
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
                        <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          Phone Number *
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            placeholder="+15554443333"
                            className={
                              form.formState.errors?.contactPersonPhone
                                ? "border-red-500"
                                : ""
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Location Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Country
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        readOnly
                        className="bg-gray-100 dark:bg-gray-800"
                      />
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
                      Province/Territory *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full text-black">
                          <SelectValue placeholder="Select your province or territory" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {canadianProvinces.map((province) => (
                          <SelectItem
                            key={province.value}
                            value={province.value}
                          >
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
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      City *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Montreal"
                        className={
                          form.formState.errors?.city ? "border-red-500" : ""
                        }
                      />
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
                      Street Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="123 Main Street"
                        className={
                          form.formState.errors?.address ? "border-red-500" : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Mission & Projects Section */}
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
                          form.getValues("projectAreas")?.includes(area) ||
                          false
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
                          form.formState.errors?.websiteUrl
                            ? "border-red-500"
                            : ""
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
                          form.formState.errors?.facebookUrl
                            ? "border-red-500"
                            : ""
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
                          form.formState.errors?.twitterUrl
                            ? "border-red-500"
                            : ""
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
                          form.formState.errors?.instagramUrl
                            ? "border-red-500"
                            : ""
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
                          form.formState.errors?.linkedinUrl
                            ? "border-red-500"
                            : ""
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Separator />

          {/* Form Actions */}
          <div className="flex justify-between items-center pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
            >
              Reset Changes
            </Button>

            <Button
              type="submit"
              disabled={!form.formState.isDirty || form.formState.isSubmitting}
              className="min-w-32"
            >
              {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
