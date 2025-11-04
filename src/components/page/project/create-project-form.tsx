"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createProject } from "@/src/actions/project";
import {
  createProjectSchema,
  type TCreateProjectSchema,
} from "@/src/schemas/project";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/src/components/ui/select";
import { Button } from "@/src/components/ui/button";

interface CreateProjectFormProps {
  /**
   * All available beneficiary types formatted for a select component.  Each
   * element must have a `value` (UUID) and a `label` to display.
   */
  beneficiaryTypes: { value: string; label: string }[];
  /**
   * The slug of the organization for which this project is being created.
   * Used to redirect back after a successful creation.
   */
  organizationSlug: string;
}

/**
 * Renders a form that allows an organization to create a new project.  It
 * collects information such as title, description, goal amount, beneficiary
 * type, optional dates and an optional background image.  Upon submission
 * the form invokes the `createProject` server action and provides user
 * feedback via toast notifications.  Successful submissions redirect back
 * to the organization page.
 */
export default function CreateProjectForm({
  beneficiaryTypes,
  organizationSlug,
}: CreateProjectFormProps) {
  const router = useRouter();
  const form = useForm<TCreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: "",
      description: "",
      goalAmount: "",
      beneficiaryType: "",
      startDate: "",
      endDate: "",
    },
  });

  // Local state to handle file input since react-hook-form doesn't manage
  // FileList types particularly well.
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: TCreateProjectSchema) {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", values.title);
    formData.append("description", values.description);
    formData.append("goalAmount", values.goalAmount);
    formData.append("beneficiaryType", values.beneficiaryType);
    if (values.startDate) {
      formData.append("startDate", values.startDate);
    }
    if (values.endDate) {
      formData.append("endDate", values.endDate);
    }
    if (file) {
      formData.append("file", file);
    }

    const res = await createProject(formData);
    if (res.success) {
      toast.success(res.message ?? "Project created successfully");
      // Redirect back to organization page
      router.push(`/organizations/${organizationSlug}`);
    } else if (res.error) {
      toast.error(res.error);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Create New Project</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Title</FormLabel>
                <FormControl>
                  <Input
                    placeholder="e.g. Winter Clothing Appeal"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Description */}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe the goals and activities of this project"
                    rows={5}
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Goal Amount */}
          <FormField
            control={form.control}
            name="goalAmount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Goal Amount</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Enter goal amount"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Beneficiary Type */}
          <FormField
            control={form.control}
            name="beneficiaryType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beneficiary Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select beneficiary type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {beneficiaryTypes.map((beneficiary) => (
                      <SelectItem
                        key={beneficiary.value}
                        value={beneficiary.value}
                      >
                        {beneficiary.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Project Background Image */}
          <div>
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block" htmlFor="project-image-input">
              Background Image (optional)
            </label>
            <input
              id="project-image-input"
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFile(e.target.files[0]);
                } else {
                  setFile(null);
                }
              }}
              disabled={isSubmitting}
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 p-2"
            />
          </div>

          {/* Submit Button */}
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? "Creating Project..." : "Create Project"}
          </Button>
        </form>
      </Form>
    </div>
  );
}