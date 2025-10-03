"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  upsertDonorProfile,
  deleteDonorProfile,
} from "@/src/actions/upsert-donor-profile";

import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Alert, AlertDescription } from "@/src/components/ui/alert";

const ProfileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional().nullable(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City / Province is required"),
  state: z.string().optional().nullable(),
  country: z.string().min(1, "Country is required"),
});

type ProfileValues = z.infer<typeof ProfileSchema>;

type Props = {
  userId: string;
  initial: {
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    state: string | null;
    country: string | null;
    profile_completed: boolean;
  };
};

export default function ProfileForm({ userId, initial }: Props) {
  const router = useRouter();

  const defaultValues: ProfileValues = {
    first_name: initial.first_name ?? "",
    last_name: initial.last_name ?? "",
    phone: initial.phone ?? "",
    address: initial.address ?? "",
    city: initial.city ?? "",
    state: initial.state ?? "",
    country: initial.country ?? "",
  };

  const [editMode, setEditMode] = useState(!initial.profile_completed);
  const [serverError, setServerError] = useState<string | null>(null);
  const [serverSuccess, setServerSuccess] = useState<string | null>(null);

  const form = useForm<ProfileValues>({
    resolver: zodResolver(ProfileSchema),
    defaultValues,
    mode: "onChange",
  });

  const { register, handleSubmit, reset, formState } = form;
  const { isDirty, isValid, isSubmitting } = formState;

  async function onSubmit(values: ProfileValues) {
    setServerError(null);
    setServerSuccess(null);

    const res = await upsertDonorProfile({
      user_id: userId,
      ...values,
      profile_completed: true,
    });

    if ("error" in res) {
      setServerError(res.error ?? "Something went wrong");
      return;
    }

    setServerSuccess(
      initial.profile_completed
        ? "Profile updated successfully!"
        : "Profile completed successfully!"
    );
    setEditMode(false);
    reset(values);
    router.refresh();
  }

  async function onDelete() {
    if (!confirm("Delete your profile? This cannot be undone.")) return;
    setServerError(null);
    setServerSuccess(null);

    const res = await deleteDonorProfile(userId);
    if ("error" in res) {
      setServerError(res.error ?? "Failed to delete profile");
      return;
    }
    setServerSuccess("Profile deleted");
    setEditMode(true);
    reset({
      first_name: "",
      last_name: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      country: "",
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      {serverError && (
        <Alert variant="destructive">
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}
      {serverSuccess && (
        <Alert>
          <AlertDescription>{serverSuccess}</AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First name</Label>
            <Input
              id="first_name"
              disabled={!editMode || isSubmitting}
              {...register("first_name")}
            />
          </div>
          <div>
            <Label htmlFor="last_name">Last name</Label>
            <Input
              id="last_name"
              disabled={!editMode || isSubmitting}
              {...register("last_name")}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            type="tel"
            disabled={!editMode || isSubmitting}
            {...register("phone")}
          />
        </div>

        <div>
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            disabled={!editMode || isSubmitting}
            {...register("address")}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City / Province</Label>
            <Input
              id="city"
              disabled={!editMode || isSubmitting}
              {...register("city")}
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              disabled={!editMode || isSubmitting}
              {...register("state")}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            disabled={!editMode || isSubmitting}
            {...register("country")}
          />
        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 pt-4">
          {!editMode && (
            <Button type="button" onClick={() => setEditMode(true)}>
              Edit profile
            </Button>
          )}

          {editMode && (
            <>
              <Button
                type="submit"
                disabled={!isDirty || !isValid || isSubmitting}
              >
                {initial.profile_completed
                  ? isSubmitting
                    ? "Updating..."
                    : "Update Profile"
                  : isSubmitting
                  ? "Saving..."
                  : "Complete Profile"}
              </Button>

              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  reset();
                  setEditMode(!initial.profile_completed ? true : false);
                }}
                disabled={isSubmitting}
              >
                Cancel
              </Button>

              {initial.profile_completed && (
                <Button
                  type="button"
                  variant="destructive"
                  onClick={onDelete}
                  disabled={isSubmitting}
                >
                  Delete Profile
                </Button>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  );
}
