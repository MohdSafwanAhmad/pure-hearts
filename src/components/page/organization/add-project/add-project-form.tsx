/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { addProject } from "@/src/actions/add-project";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/src/components/ui/select";

type BeneficiaryType = { id: string; label: string; code: string };

export default function AddProjectForm({
  beneficiaryTypes,
  organizationSlug, // not used in submit, but useful if you navigate afterwards
}: {
  beneficiaryTypes: BeneficiaryType[];
  organizationSlug: string;
}) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    const payload = {
      title: String(formData.get("title") || "").trim(),
      description: String(formData.get("description") || "").trim(),
      goal_amount: Number(formData.get("goal_amount") || 0),
      start_date: String(formData.get("start_date") || ""),
      end_date: String(formData.get("end_date") || ""),
      beneficiary_type_id: String(formData.get("beneficiary_type_id") || ""),
      project_background_image:
        (formData.get("project_background_image") as string) || null,
    };

    const res = await addProject(payload);
    setSubmitting(false);

    if (!res.ok) {
      setError(res.error);
      return;
    }

    setSuccess("Project created successfully.");
    // optional: navigate to project page
    // router.push(`/campaigns/${organizationSlug}/${res.slug}`);
  }

  const labelCls = "block text-base font-semibold text-gray-900 mb-1.5";
  const inputCls = "h-11 text-[15px]";

  return (
    <form action={onSubmit} className="space-y-6">
      {/* top alert */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 text-red-700 px-4 py-3 text-sm">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm">
          {success}
        </div>
      )}

      {/* 2-column responsive grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title (full width) */}
        <div className="md:col-span-2">
          <Label htmlFor="title" className={labelCls}>
            Title *
          </Label>
          <Input id="title" name="title" required className={inputCls} />
        </div>

        {/* Description (full width) */}
        <div className="md:col-span-2">
          <Label htmlFor="description" className={labelCls}>
            Description *
          </Label>
          <Textarea
            id="description"
            name="description"
            required
            className="min-h-[120px] text-[15px]"
          />
        </div>

        {/* Goal */}
        <div>
          <Label htmlFor="goal_amount" className={labelCls}>
            Goal Amount *
          </Label>
          <Input
            id="goal_amount"
            name="goal_amount"
            type="number"
            min={1}
            inputMode="decimal"
            required
            className={inputCls}
          />
        </div>

        {/* Start Date */}
        <div>
          <Label htmlFor="start_date" className={labelCls}>
            Start Date *
          </Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            required
            className={inputCls}
          />
        </div>

        {/* End Date */}
        <div>
          <Label htmlFor="end_date" className={labelCls}>
            End Date *
          </Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            required
            className={inputCls}
          />
        </div>

        {/* Beneficiary Type */}
        <div>
          <Label className={labelCls}>Beneficiary Type *</Label>
          <Select name="beneficiary_type_id" required>
            <SelectTrigger className={inputCls}>
              <SelectValue placeholder="Select beneficiary type" />
            </SelectTrigger>
            <SelectContent>
              {beneficiaryTypes.map((b) => (
                <SelectItem key={b.id} value={b.id}>
                  {b.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Background Image (full width) */}
        <div className="md:col-span-2">
          <Label htmlFor="project_background_image" className={labelCls}>
            Background Image (URL)
          </Label>
          <Input
            id="project_background_image"
            name="project_background_image"
            type="url"
            placeholder="https://…"
            className={inputCls}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="pt-2">
        <Button type="submit" size="lg" disabled={submitting}>
          {submitting ? "Creating…" : "Create Project"}
        </Button>
      </div>
    </form>
  );
}
