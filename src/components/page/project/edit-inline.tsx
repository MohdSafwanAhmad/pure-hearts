"use client";

import { useState, useTransition, FormEvent } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { Label } from "@/src/components/ui/label";
import { updateProject, deleteProject } from "@/src/actions/project";
import { toast } from "sonner";

type EditInlineProps = {
  projectId: string;
  orgSlug: string;
  slug: string;
  // seed values
  title: string;
  description: string | null;
  goalAmount: number;
  beneficiaryTypeId: string | null;
  startDate?: string | null;  // "YYYY-MM-DD"
  endDate?: string | null;    // "YYYY-MM-DD"
};

export default function EditProjectInline(props: EditInlineProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateProject(props.projectId, fd);
      if (res.success) {
        toast.success("Project updated");
        setOpen(false);
      } else {
        toast.error(res.error ?? "Failed to update project");
      }
    });
  }

  function onDelete() {
    startTransition(async () => {
      const res = await deleteProject(props.projectId);
      if (res.success) {
        toast.success("Project deleted");
        // after soft delete, take user back to org page; server action revalidates
        window.location.href = `/organizations/${props.orgSlug}`;
      } else {
        toast.error(res.error ?? "Failed to delete project");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg">Edit Project</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Project</DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4">
          {/* title */}
          <div className="space-y-2">
            <Label htmlFor="title">Project Title</Label>
            <Input id="title" name="title" defaultValue={props.title} required />
          </div>

          {/* description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" defaultValue={props.description ?? ""} required />
          </div>

          {/* goal */}
          <div className="space-y-2">
            <Label htmlFor="goalAmount">Goal Amount</Label>
            <Input id="goalAmount" name="goalAmount" type="number" step="1" min="1" defaultValue={props.goalAmount} required />
          </div>

          {/* beneficiary */}
          <div className="space-y-2">
            <Label htmlFor="beneficiaryType">Beneficiary Type Id</Label>
            <Input
              id="beneficiaryType"
              name="beneficiaryType"
              defaultValue={props.beneficiaryTypeId ?? ""}
              placeholder="UUID of beneficiary type"
            />
          </div>

          {/* dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input id="startDate" name="startDate" type="date" defaultValue={props.startDate ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input id="endDate" name="endDate" type="date" defaultValue={props.endDate ?? ""} />
            </div>
          </div>

          {/* optional new background image */}
          <div className="space-y-2">
            <Label htmlFor="file">Background Image (optional)</Label>
            <Input id="file" name="file" type="file" accept="image/*" />
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button type="button" variant="destructive" onClick={onDelete} disabled={isPending}>
              Delete Project
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
