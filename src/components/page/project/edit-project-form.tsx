"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { updateProject, deleteProject } from "@/src/actions/project";
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

interface EditProjectFormProps {
  /**
   * Existing project details.  Contains all fields from ProjectDetail plus
   * optional start_date and end_date strings.
   */
  project: {
    id: string;
    title: string;
    description: string | null;
    goal_amount: number;
    collected: number;
    remaining: number;
    percent: number;
    project_background_image: string | null;
    organization_user_id: string;
    beneficiary?: {
      beneficiary_type_id: string;
      label: string;
    } | null;
    slug: string;
    organization: {
      user_id: string;
      slug: string;
      name: string | null;
      logo?: string | null;
      mission_statement?: string | null;
    };
    start_date?: string | null;
    end_date?: string | null;
  };
  /**
   * Beneficiary types formatted for the Select component.
   */
  beneficiaryTypes: { value: string; label: string }[];
  /**
   * The slug of the organization owning this project, used for navigation.
   */
  organizationSlug: string;
}

/**
 * Renders a form that allows an organization to edit an existing project.  It
 * prepopulates fields with the current project values and invokes the
 * appropriate server actions to update or delete the project.  After
 * success, it redirects to the project or organization page and displays
 * toast notifications.
 */
export default function EditProjectForm({
  project,
  beneficiaryTypes,
  organizationSlug,
}: EditProjectFormProps) {
  const router = useRouter();
  const form = useForm<TCreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      title: project.title,
      description: project.description ?? "",
      goalAmount: project.goal_amount ? String(project.goal_amount) : "",
      beneficiaryType: project.beneficiary?.beneficiary_type_id ?? "",
      startDate: project.start_date ?? "",
      endDate: project.end_date ?? "",
    },
  });

  // Local state to handle file input since react-hook-form doesn't manage FileList well
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

    const res = await updateProject(project.id, formData);
    if (res.success) {
      toast.success(res.message ?? "Project updated successfully");
      // Redirect back to the project detail page using the project's organization slug
      router.push(`/campaigns/${project.organization.slug}/${project.slug}`);
    } else if (res.error) {
      toast.error(res.error);
    }
    setIsSubmitting(false);
  }

  async function handleDelete() {
    if (!project || isSubmitting) return;
    setIsSubmitting(true);
    const res = await deleteProject(project.id);
    if (res.success) {
      toast.success(res.message ?? "Project deleted successfully");
      // After deletion, redirect to the organization page
      router.push(`/organizations/${organizationSlug}`);
    } else if (res.error) {
      toast.error(res.error);
    }
    setIsSubmitting(false);
  }

  return (
    <div className="max-w-3xl mx-auto py-6">
      <h1 className="text-2xl font-bold mb-4">Edit Project</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
            <label
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block"
              htmlFor="project-image-input"
            >
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

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
              {isSubmitting ? "Saving changes..." : "Save Changes"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Delete Project
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}