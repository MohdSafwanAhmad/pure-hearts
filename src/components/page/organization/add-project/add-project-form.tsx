// src\components\page\organization\add-project\add-project-form.tsx

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTransition, useState } from "react";
import { useForm, type SubmitHandler, type Resolver } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { addProject } from "@/src/actions/add-project";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/src/components/ui/select";
import { cn } from "@/src/lib/utils";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  goal_amount: z.coerce.number().positive("Goal must be > 0"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().min(1, "End date is required"),
  beneficiary_type_id: z.string().min(1, "Beneficiary type is required"),
  project_background_image: z.string().optional().nullable(),
});
type FormValues = z.infer<typeof schema>;

// resolver typed to be version-agnostic
const resolver: Resolver<FormValues> = zodResolver(
  schema
) as unknown as Resolver<FormValues>;

export default function AddProjectForm({
  beneficiaryTypes,
  organizationSlug,
  className,
}: {
  beneficiaryTypes: Array<{ id: string; label: string; code: string }>;
  organizationSlug: string;
  className?: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver,
    defaultValues: {
      title: "",
      description: "",
      goal_amount: 0,
      start_date: "",
      end_date: "",
      beneficiary_type_id: "",
      project_background_image: null,
    },
  });

  const onSubmit: SubmitHandler<FormValues> = (values) => {
    setServerError(null);
    startTransition(async () => {
      const res = await addProject(values);
      if (res.ok) {
        // back to org page, show Existing tab
        router.push(`/organizations/${organizationSlug}?tab=existing`);
      } else {
        setServerError(res.error || "Failed to create project");
      }
    });
  };

  return (
    <form
      className={cn("space-y-6", className)}
      onSubmit={form.handleSubmit(onSubmit)}
    >
      {serverError && (
        <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
          {serverError}
        </div>
      )}

      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="title">Title *</Label>
          <Input id="title" {...form.register("title")} />
          {form.formState.errors.title && (
            <p className="text-xs text-destructive">
              {form.formState.errors.title.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            rows={5}
            {...form.register("description")}
          />
          {form.formState.errors.description && (
            <p className="text-xs text-destructive">
              {form.formState.errors.description.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="goal_amount">Goal Amount *</Label>
          <Input
            id="goal_amount"
            type="number"
            step="0.01"
            {...form.register("goal_amount")}
          />
          {form.formState.errors.goal_amount && (
            <p className="text-xs text-destructive">
              {form.formState.errors.goal_amount.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="start_date">Start Date *</Label>
            <Input
              id="start_date"
              type="date"
              {...form.register("start_date")}
            />
            {form.formState.errors.start_date && (
              <p className="text-xs text-destructive">
                {form.formState.errors.start_date.message}
              </p>
            )}
          </div>

          <div className="grid gap-2">
            <Label htmlFor="end_date">End Date *</Label>
            <Input id="end_date" type="date" {...form.register("end_date")} />
            {form.formState.errors.end_date && (
              <p className="text-xs text-destructive">
                {form.formState.errors.end_date.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-2">
          <Label>Beneficiary Type *</Label>
          <Select
            onValueChange={(v) =>
              form.setValue("beneficiary_type_id", v, {
                shouldValidate: true,
                shouldDirty: true,
              })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a beneficiary type" />
            </SelectTrigger>
            <SelectContent>
              {beneficiaryTypes.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.beneficiary_type_id && (
            <p className="text-xs text-destructive">
              {form.formState.errors.beneficiary_type_id.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="project_background_image">
            Background Image (URL)
          </Label>
          <Input
            id="project_background_image"
            {...form.register("project_background_image")}
          />
        </div>
      </div>

      <Button type="submit" disabled={pending}>
        {pending ? "Creating..." : "Create Project"}
      </Button>
    </form>
  );
}
